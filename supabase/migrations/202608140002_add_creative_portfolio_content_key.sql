-- Allow the Creative Portfolio collection to be stored in site_content.
-- Existing rows are preserved while the allowed-key constraint is refreshed.

alter table public.site_content
drop constraint if exists site_content_key_check;

alter table public.site_content
add constraint site_content_key_check check (key in (
  'site_settings',
  'page_content',
  'milestones',
  'press_articles',
  'recognitions',
  'services',
  'partners',
  'case_studies',
  'team_members',
  'process_steps',
  'creative_portfolio'
));
