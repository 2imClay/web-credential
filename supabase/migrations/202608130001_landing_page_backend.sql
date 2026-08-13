-- DGM Credential landing-page backend
-- Company email domain: @digimind.asia

create table if not exists public.site_content (
  key text primary key check (key in (
    'site_settings',
    'page_content',
    'milestones',
    'press_articles',
    'recognitions',
    'services',
    'partners',
    'case_studies',
    'team_members',
    'process_steps'
  )),
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

comment on table public.site_content is
  'Editable content for the public DGM Credential landing page.';

create or replace function public.is_digimind_company_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.role()) = 'authenticated'
    and lower(coalesce((select auth.jwt()) ->> 'email', ''))
      ~ '^[^@[:space:]]+@digimind[.]asia$';
$$;

revoke all on function public.is_digimind_company_user() from public, anon;
grant execute on function public.is_digimind_company_user() to authenticated;

create or replace function public.set_site_content_audit_fields()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists set_site_content_audit_fields on public.site_content;
create trigger set_site_content_audit_fields
before insert or update on public.site_content
for each row execute function public.set_site_content_audit_fields();

alter table public.site_content enable row level security;

drop policy if exists "Public can read landing page content" on public.site_content;
create policy "Public can read landing page content"
on public.site_content for select
to anon, authenticated
using (true);

drop policy if exists "Company users can insert landing page content" on public.site_content;
create policy "Company users can insert landing page content"
on public.site_content for insert
to authenticated
with check ((select public.is_digimind_company_user()));

drop policy if exists "Company users can update landing page content" on public.site_content;
create policy "Company users can update landing page content"
on public.site_content for update
to authenticated
using ((select public.is_digimind_company_user()))
with check ((select public.is_digimind_company_user()));

drop policy if exists "Company users can delete landing page content" on public.site_content;
create policy "Company users can delete landing page content"
on public.site_content for delete
to authenticated
using ((select public.is_digimind_company_user()));

revoke select on public.site_content from anon, authenticated;
grant select (key, value, updated_at) on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'site_content'
  ) then
    alter publication supabase_realtime add table public.site_content;
  end if;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read site assets" on storage.objects;
create policy "Public can read site assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'site-assets');

drop policy if exists "Company users can upload site assets" on storage.objects;
create policy "Company users can upload site assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'site-assets'
  and (select public.is_digimind_company_user())
);

drop policy if exists "Company users can update site assets" on storage.objects;
create policy "Company users can update site assets"
on storage.objects for update
to authenticated
using (
  bucket_id = 'site-assets'
  and (select public.is_digimind_company_user())
)
with check (
  bucket_id = 'site-assets'
  and (select public.is_digimind_company_user())
);

drop policy if exists "Company users can delete site assets" on storage.objects;
create policy "Company users can delete site assets"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'site-assets'
  and (select public.is_digimind_company_user())
);

-- Enable this Postgres function in Authentication > Hooks > Before User Created.
-- It prevents non-company accounts from being created even if Auth is called directly.
create or replace function public.hook_restrict_digimind_signup(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  signup_email text := lower(coalesce(event -> 'user' ->> 'email', ''));
begin
  if signup_email !~ '^[^@[:space:]]+@digimind[.]asia$' then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 403,
        'message', 'Only @digimind.asia email addresses are allowed.'
      )
    );
  end if;

  return '{}'::jsonb;
end;
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.hook_restrict_digimind_signup(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_restrict_digimind_signup(jsonb)
from public, anon, authenticated;
