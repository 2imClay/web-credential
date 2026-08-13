-- Allow manually created Supabase email/password users to manage Content
-- Studio. Disable public signup in Authentication settings.

drop policy if exists "Company users can insert landing page content" on public.site_content;
drop policy if exists "Company users can update landing page content" on public.site_content;
drop policy if exists "Company users can delete landing page content" on public.site_content;
drop policy if exists "Authenticated users can insert landing page content" on public.site_content;
drop policy if exists "Authenticated users can update landing page content" on public.site_content;
drop policy if exists "Authenticated users can delete landing page content" on public.site_content;

create policy "Authenticated users can insert landing page content"
on public.site_content for insert
to authenticated
with check (true);

create policy "Authenticated users can update landing page content"
on public.site_content for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete landing page content"
on public.site_content for delete
to authenticated
using (true);

drop policy if exists "Company users can upload site assets" on storage.objects;
drop policy if exists "Company users can update site assets" on storage.objects;
drop policy if exists "Company users can delete site assets" on storage.objects;
drop policy if exists "Authenticated users can upload site assets" on storage.objects;
drop policy if exists "Authenticated users can update site assets" on storage.objects;
drop policy if exists "Authenticated users can delete site assets" on storage.objects;

drop function if exists public.is_digimind_company_user();

create policy "Authenticated users can upload site assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-assets');

create policy "Authenticated users can update site assets"
on storage.objects for update
to authenticated
using (bucket_id = 'site-assets')
with check (bucket_id = 'site-assets');

create policy "Authenticated users can delete site assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-assets');

-- If the old hook was enabled, this keeps it harmless until it is disabled
-- in Authentication > Hooks.
create or replace function public.hook_restrict_digimind_signup(event jsonb)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select '{}'::jsonb;
$$;

grant execute on function public.hook_restrict_digimind_signup(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_restrict_digimind_signup(jsonb)
from public, anon, authenticated;

