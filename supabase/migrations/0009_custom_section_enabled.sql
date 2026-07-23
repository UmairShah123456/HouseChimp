-- Per-custom-section visibility toggle. Built-in sections store this in
-- properties.section_titles[type].enabled; custom sections are their own rows,
-- so they get a dedicated column. Defaults to true so existing sections keep
-- showing on the guest home screen.

alter table public.custom_sections
  add column if not exists enabled boolean not null default true;
