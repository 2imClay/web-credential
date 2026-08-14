-- Allow Social Seeding methodology slides and image-only cases in Content Studio.

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
  'creative_portfolio',
  'social_seeding_theory',
  'social_seeding_cases'
));
