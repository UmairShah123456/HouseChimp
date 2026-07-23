-- Table-level privileges for the Supabase roles. RLS (enabled in 0002) still
-- governs what anon/authenticated can actually see; these grants are the
-- prerequisite layer. service_role additionally bypasses RLS, which is how the
-- guest magic-link server path reads any property's guide.

grant usage on schema public to anon, authenticated, service_role;

grant all privileges on all tables in schema public to anon, authenticated, service_role;
grant all privileges on all sequences in schema public to anon, authenticated, service_role;
grant all privileges on all routines in schema public to anon, authenticated, service_role;

-- Cover objects created by later migrations too.
alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on routines to anon, authenticated, service_role;
