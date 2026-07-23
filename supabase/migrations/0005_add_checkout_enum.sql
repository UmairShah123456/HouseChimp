-- Add a standalone "check_out" guide section type. Kept in its own migration:
-- a new enum value can't be used in the same transaction that adds it, so the
-- backfill that references it lives in the next migration.
alter type public.guide_section_type add value if not exists 'check_out';
