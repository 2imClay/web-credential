-- Add the first iTVC Creative Portfolio set without replacing existing items.

do $$
declare
  itvc_items jsonb := jsonb_build_array(
    jsonb_build_object(
      'id', 'portfolio-itvc-cover',
      'category', 1,
      'image', '/creative-portfolio/itvc/01-cover.jpg',
      'alt', 'DGM Creative Portfolio — iTVC'
    ),
    jsonb_build_object(
      'id', 'portfolio-itvc-isuzu-nhap-hoi-dan-chuyen',
      'category', 1,
      'image', '/creative-portfolio/itvc/02-nhap-hoi-dan-chuyen.jpg',
      'alt', 'Nhập Hội Dẫn Chuyện — Isuzu Vietnam 2024'
    ),
    jsonb_build_object(
      'id', 'portfolio-itvc-mazda-every-mile-memory',
      'category', 1,
      'image', '/creative-portfolio/itvc/03-every-mile-is-a-memory.jpg',
      'alt', 'Every mile is a memory — Mazda Vietnam 2024'
    )
  );
begin
  if exists (select 1 from public.site_content where key = 'creative_portfolio') then
    update public.site_content
    set value = coalesce(
      (
        select jsonb_agg(item)
        from jsonb_array_elements(
          case when jsonb_typeof(value) = 'array' then value else '[]'::jsonb end
        ) as item
        where item ->> 'id' not in (
          'portfolio-itvc-cover',
          'portfolio-itvc-isuzu-nhap-hoi-dan-chuyen',
          'portfolio-itvc-mazda-every-mile-memory'
        )
      ),
      '[]'::jsonb
    ) || itvc_items
    where key = 'creative_portfolio';
  else
    insert into public.site_content (key, value)
    values ('creative_portfolio', itvc_items);
  end if;

  update public.site_content
  set value = jsonb_set(
    value,
    '{portfolio}',
    coalesce(value -> 'portfolio', '{}'::jsonb) || jsonb_build_object('categoryOne', 'iTVC'),
    true
  )
  where key = 'page_content';
end;
$$;
