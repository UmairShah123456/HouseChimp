-- Backfill a check_out section for every existing property, migrating any
-- checkout checklist that currently lives inside house_rules.

insert into public.guide_sections (property_id, type, position, content)
select
  p.id,
  'check_out',
  6,
  jsonb_build_object(
    'eyebrow', 'Before you go',
    'headline', 'Checking out',
    'label', coalesce(hr.content -> 'checkout' ->> 'label', ''),
    'items', coalesce(hr.content -> 'checkout' -> 'items', '[]'::jsonb)
  )
from public.properties p
left join public.guide_sections hr
  on hr.property_id = p.id and hr.type = 'house_rules'
where not exists (
  select 1 from public.guide_sections co
  where co.property_id = p.id and co.type = 'check_out'
);

-- Remove the migrated checklist from house_rules.
update public.guide_sections
set content = content - 'checkout'
where type = 'house_rules' and content ? 'checkout';
