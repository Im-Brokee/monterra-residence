-- STEP 1: Supabase Dashboard > Authentication > Users > Add user.
-- STEP 2: Copy that user's UUID.
-- STEP 3: Replace the UUID below and run this query.

insert into public.admin_profiles(user_id, display_name, role)
values ('PASTE_AUTH_USER_UUID_HERE', 'Administrator', 'admin')
on conflict (user_id) do update set display_name = excluded.display_name, role = excluded.role;
