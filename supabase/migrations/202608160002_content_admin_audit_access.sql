-- Every account manually added to Supabase Authentication is a Content Studio user.
-- Public/anonymous visitors still have no access to edit history.

drop policy if exists "Company users can read content edit history" on public.site_content_audit_log;
drop policy if exists "Content Studio admins can read content edit history" on public.site_content_audit_log;

create policy "Authenticated Content Studio users can read content edit history"
on public.site_content_audit_log for select
to authenticated
using ((select auth.uid()) is not null);

