-- Local guide entries: drop the walk-time field (unused in the redesigned
-- editor), add price and hours for richer place info.
alter table public.local_guide_entries drop column if exists walk_time;
alter table public.local_guide_entries add column if not exists price text;
alter table public.local_guide_entries add column if not exists hours text;
