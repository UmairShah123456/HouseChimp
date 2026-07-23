-- Custom sections + renamable section titles.
--
-- 1. properties.section_titles: per-property overrides for the built-in section
--    names. Shape: { "<section_type>": { "title": text, "subtitle": text } }.
--    A single override drives BOTH the host dashboard list and the guest home
--    tile, so a host renames a section once and the guest sees the same name.
--
-- 2. custom_sections: free-form host-authored sections that live only on the
--    guest home screen (a tile that opens its own title + body page). Unlike
--    guide_sections these are not enum-typed and a property can have many.

alter table public.properties
  add column if not exists section_titles jsonb not null default '{}'::jsonb;

create table public.custom_sections (
  id           uuid primary key default gen_random_uuid(),
  property_id  uuid not null references public.properties(id) on delete cascade,
  title        text not null default '',
  subtitle     text,
  body         text,
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index custom_sections_property_id_idx on public.custom_sections(property_id);

create trigger custom_sections_set_updated_at
  before update on public.custom_sections
  for each row execute function public.set_updated_at();

-- RLS — membership resolved via the parent property, mirroring guide_sections.
alter table public.custom_sections enable row level security;

create policy "members read custom sections"
  on public.custom_sections for select
  using (exists (
    select 1 from public.properties p
    where p.id = custom_sections.property_id
      and public.is_account_member(p.account_id)
  ));

create policy "members write custom sections"
  on public.custom_sections for all
  using (exists (
    select 1 from public.properties p
    where p.id = custom_sections.property_id
      and public.is_account_member(p.account_id)
  ))
  with check (exists (
    select 1 from public.properties p
    where p.id = custom_sections.property_id
      and public.is_account_member(p.account_id)
  ));

-- Explicit grants (RLS still governs row visibility; service_role bypasses RLS
-- for the guest magic-link read path).
grant all privileges on public.custom_sections to anon, authenticated, service_role;
