-- Keep the four Creative Portfolio category labels in sync with the admin UI.

update public.site_content
set value = jsonb_set(
  value,
  '{portfolio}',
  coalesce(value -> 'portfolio', '{}'::jsonb) || jsonb_build_object(
    'categoryOne', 'iTVC',
    'categoryTwo', 'Experiential Video / Testimonial Video',
    'categoryThree', 'KV / Social Post Always On',
    'categoryFour', 'Photo Shooting'
  ),
  true
)
where key = 'page_content';
