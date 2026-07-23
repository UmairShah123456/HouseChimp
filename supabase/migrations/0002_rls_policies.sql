-- Row Level Security: an account's data is visible only to its members.
-- The authenticated dashboard uses the anon/session client and is fully bound
-- by these policies. Guest (magic-link) routes never touch these tables through
-- an end-user session — the server resolves them with the service role, which
-- bypasses RLS by design.

alter table public.accounts            enable row level security;
alter table public.account_members     enable row level security;
alter table public.properties          enable row level security;
alter table public.guide_sections      enable row level security;
alter table public.media_items         enable row level security;
alter table public.local_guide_entries enable row level security;
alter table public.magic_links         enable row level security;

-- ---------------------------------------------------------------------------
-- accounts
-- ---------------------------------------------------------------------------
create policy "members read their account"
  on public.accounts for select
  using (public.is_account_member(id));

create policy "owners update their account"
  on public.accounts for update
  using (public.is_account_member(id))
  with check (public.is_account_member(id));

-- Account creation is handled by a SECURITY DEFINER RPC (create_account_with_owner)
-- so the creating user is atomically inserted as owner; no direct INSERT policy.

-- ---------------------------------------------------------------------------
-- account_members
-- ---------------------------------------------------------------------------
create policy "members read the roster"
  on public.account_members for select
  using (public.is_account_member(account_id));

create policy "owners manage the roster"
  on public.account_members for all
  using (
    exists (
      select 1 from public.account_members m
      where m.account_id = account_members.account_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  )
  with check (
    exists (
      select 1 from public.account_members m
      where m.account_id = account_members.account_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

-- ---------------------------------------------------------------------------
-- properties
-- ---------------------------------------------------------------------------
create policy "members read properties"
  on public.properties for select
  using (public.is_account_member(account_id));

create policy "members write properties"
  on public.properties for all
  using (public.is_account_member(account_id))
  with check (public.is_account_member(account_id));

-- ---------------------------------------------------------------------------
-- guide_sections  (membership resolved via the parent property)
-- ---------------------------------------------------------------------------
create policy "members read sections"
  on public.guide_sections for select
  using (exists (
    select 1 from public.properties p
    where p.id = guide_sections.property_id
      and public.is_account_member(p.account_id)
  ));

create policy "members write sections"
  on public.guide_sections for all
  using (exists (
    select 1 from public.properties p
    where p.id = guide_sections.property_id
      and public.is_account_member(p.account_id)
  ))
  with check (exists (
    select 1 from public.properties p
    where p.id = guide_sections.property_id
      and public.is_account_member(p.account_id)
  ));

-- ---------------------------------------------------------------------------
-- media_items
-- ---------------------------------------------------------------------------
create policy "members read media"
  on public.media_items for select
  using (exists (
    select 1 from public.properties p
    where p.id = media_items.property_id
      and public.is_account_member(p.account_id)
  ));

create policy "members write media"
  on public.media_items for all
  using (exists (
    select 1 from public.properties p
    where p.id = media_items.property_id
      and public.is_account_member(p.account_id)
  ))
  with check (exists (
    select 1 from public.properties p
    where p.id = media_items.property_id
      and public.is_account_member(p.account_id)
  ));

-- ---------------------------------------------------------------------------
-- local_guide_entries  (membership via section -> property)
-- ---------------------------------------------------------------------------
create policy "members read local entries"
  on public.local_guide_entries for select
  using (exists (
    select 1 from public.guide_sections s
    join public.properties p on p.id = s.property_id
    where s.id = local_guide_entries.guide_section_id
      and public.is_account_member(p.account_id)
  ));

create policy "members write local entries"
  on public.local_guide_entries for all
  using (exists (
    select 1 from public.guide_sections s
    join public.properties p on p.id = s.property_id
    where s.id = local_guide_entries.guide_section_id
      and public.is_account_member(p.account_id)
  ))
  with check (exists (
    select 1 from public.guide_sections s
    join public.properties p on p.id = s.property_id
    where s.id = local_guide_entries.guide_section_id
      and public.is_account_member(p.account_id)
  ));

-- ---------------------------------------------------------------------------
-- magic_links
-- ---------------------------------------------------------------------------
create policy "members read links"
  on public.magic_links for select
  using (exists (
    select 1 from public.properties p
    where p.id = magic_links.property_id
      and public.is_account_member(p.account_id)
  ));

create policy "members write links"
  on public.magic_links for all
  using (exists (
    select 1 from public.properties p
    where p.id = magic_links.property_id
      and public.is_account_member(p.account_id)
  ))
  with check (exists (
    select 1 from public.properties p
    where p.id = magic_links.property_id
      and public.is_account_member(p.account_id)
  ));

-- ---------------------------------------------------------------------------
-- Account creation RPC — inserts the account and its owner atomically.
-- ---------------------------------------------------------------------------
create or replace function public.create_account_with_owner(p_name text)
returns public.accounts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account public.accounts;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  insert into public.accounts (name)
  values (coalesce(nullif(trim(p_name), ''), 'My account'))
  returning * into v_account;

  insert into public.account_members (account_id, user_id, role)
  values (v_account.id, auth.uid(), 'owner');

  return v_account;
end;
$$;

grant execute on function public.create_account_with_owner(text) to authenticated;
