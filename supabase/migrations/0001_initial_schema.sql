-- HomeHawk initial schema
-- Accounts own everything. Guide content is structured per section type in JSONB.
-- Magic links are resolved purely off their token by the server (service role),
-- so guest reads never depend on an authenticated session.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- accounts
-- ---------------------------------------------------------------------------
create table public.accounts (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  logo_url     text,
  accent_hue   integer not null default 200, -- OKLCH hue driving branding.accent_color
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger accounts_set_updated_at
  before update on public.accounts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- account_members  (owner/member — future team support)
-- ---------------------------------------------------------------------------
create table public.account_members (
  account_id   uuid not null references public.accounts(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null default 'member' check (role in ('owner', 'member')),
  created_at   timestamptz not null default now(),
  primary key (account_id, user_id)
);

create index account_members_user_id_idx on public.account_members(user_id);

-- Membership check used by every RLS policy. SECURITY DEFINER so it can read
-- account_members without tripping that table's own RLS (avoids recursion).
create or replace function public.is_account_member(p_account_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.account_members m
    where m.account_id = p_account_id
      and m.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- properties
-- ---------------------------------------------------------------------------
create table public.properties (
  id             uuid primary key default gen_random_uuid(),
  account_id     uuid not null references public.accounts(id) on delete cascade,
  name           text not null,
  address        text,
  hero_image_url text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index properties_account_id_idx on public.properties(account_id);

create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- guide_sections  (content shape varies by type — see src/lib/guide/types.ts)
-- ---------------------------------------------------------------------------
create type public.guide_section_type as enum (
  'parking',
  'check_in',
  'amenities',
  'local_guide',
  'wifi',
  'house_rules',
  'emergency_contacts'
);

create table public.guide_sections (
  id           uuid primary key default gen_random_uuid(),
  property_id  uuid not null references public.properties(id) on delete cascade,
  type         public.guide_section_type not null,
  content      jsonb not null default '{}'::jsonb,
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (property_id, type)
);

create index guide_sections_property_id_idx on public.guide_sections(property_id);

create trigger guide_sections_set_updated_at
  before update on public.guide_sections
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- media_items  (images/videos, optionally scoped to a section)
-- ---------------------------------------------------------------------------
create table public.media_items (
  id               uuid primary key default gen_random_uuid(),
  property_id      uuid not null references public.properties(id) on delete cascade,
  guide_section_id uuid references public.guide_sections(id) on delete cascade,
  type             text not null check (type in ('image', 'video')),
  url              text not null,
  poster_url       text,
  caption          text,
  position         integer not null default 0,
  metadata         jsonb not null default '{}'::jsonb, -- e.g. { "duration": "0:48" }
  created_at       timestamptz not null default now()
);

create index media_items_property_id_idx on public.media_items(property_id);
create index media_items_section_id_idx on public.media_items(guide_section_id);

-- ---------------------------------------------------------------------------
-- local_guide_entries
-- ---------------------------------------------------------------------------
create table public.local_guide_entries (
  id               uuid primary key default gen_random_uuid(),
  guide_section_id uuid not null references public.guide_sections(id) on delete cascade,
  category         text not null,
  name             text not null,
  description      text,
  walk_time        text,
  lat              double precision,
  lng              double precision,
  url              text,
  position         integer not null default 0,
  created_at       timestamptz not null default now()
);

create index local_guide_entries_section_id_idx on public.local_guide_entries(guide_section_id);

-- ---------------------------------------------------------------------------
-- magic_links
-- ---------------------------------------------------------------------------
create table public.magic_links (
  id           uuid primary key default gen_random_uuid(),
  property_id  uuid not null references public.properties(id) on delete cascade,
  token        text not null unique,
  pin          text,
  expires_at   timestamptz,
  view_count   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index magic_links_token_idx on public.magic_links(token);
create index magic_links_property_id_idx on public.magic_links(property_id);

-- Atomic view-count bump used by the guest server route. SECURITY DEFINER so it
-- runs regardless of RLS; granted to anon since guest routes are unauthenticated.
create or replace function public.increment_link_view(p_token text)
returns void
language sql
volatile
security definer
set search_path = public
as $$
  update public.magic_links set view_count = view_count + 1 where token = p_token;
$$;

grant execute on function public.increment_link_view(text) to anon, authenticated;
