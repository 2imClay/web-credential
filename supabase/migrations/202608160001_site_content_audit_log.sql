-- Keep a permanent, account-aware history of every Content Studio change.

create table if not exists public.site_content_audit_log (
  id bigint generated always as identity primary key,
  content_key text not null,
  action text not null check (action in ('insert', 'update', 'delete')),
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  changed_at timestamptz not null default now(),
  old_value jsonb,
  new_value jsonb
);

comment on table public.site_content_audit_log is
  'Immutable edit history for DGM Content Studio, populated by a database trigger.';

create index if not exists site_content_audit_log_changed_at_idx
on public.site_content_audit_log (changed_at desc, id desc);

create index if not exists site_content_audit_log_actor_idx
on public.site_content_audit_log (actor_id, changed_at desc);

create or replace function public.log_site_content_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and old.value is not distinct from new.value then
    return new;
  end if;

  insert into public.site_content_audit_log (
    content_key,
    action,
    actor_id,
    actor_email,
    old_value,
    new_value
  ) values (
    case when tg_op = 'DELETE' then old.key else new.key end,
    lower(tg_op),
    auth.uid(),
    lower(coalesce((select auth.jwt()) ->> 'email', '')),
    case when tg_op = 'INSERT' then null else old.value end,
    case when tg_op = 'DELETE' then null else new.value end
  );

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

revoke all on function public.log_site_content_change() from public, anon, authenticated;

drop trigger if exists log_site_content_change on public.site_content;
create trigger log_site_content_change
after insert or update or delete on public.site_content
for each row execute function public.log_site_content_change();

alter table public.site_content_audit_log enable row level security;

drop policy if exists "Company users can read content edit history" on public.site_content_audit_log;
create policy "Company users can read content edit history"
on public.site_content_audit_log for select
to authenticated
using (
  (select auth.uid()) is not null
  and lower(coalesce((select auth.jwt()) ->> 'email', ''))
    ~ '^[^@[:space:]]+@digimind[.]asia$'
);

revoke all on public.site_content_audit_log from anon, authenticated;
grant select on public.site_content_audit_log to authenticated;
