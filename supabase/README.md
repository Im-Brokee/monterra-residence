# Supabase setup

Run in this order:

1. `01_schema.sql`
2. `02_seed.sql`
3. Create an Auth user in Supabase Dashboard.
4. Put the Auth UUID into `03_make_admin.sql` and run it.

Then add Project URL + Publishable key to `.env.local` and to Vercel Environment Variables.
