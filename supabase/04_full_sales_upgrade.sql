-- MON TERRA RESIDENCE — full sales upgrade
-- Run AFTER 01_schema.sql and 02_seed.sql.
-- Safe to rerun.

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  code text not null,
  type text not null check (type in ('parking','storage')),
  name text not null,
  description text,
  building text,
  floor integer,
  area numeric(8,2),
  price numeric(12,2) not null check (price >= 0),
  status text not null default 'available' check (status in ('available','reserved','sold')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, code)
);

create index if not exists inventory_project_idx on public.inventory_items(project_id);
create index if not exists inventory_type_status_idx on public.inventory_items(type, status);

alter table public.leads add column if not exists selected_inventory jsonb not null default '[]'::jsonb;
alter table public.leads add column if not exists inventory_total numeric(12,2) not null default 0;

-- updated_at for inventory
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists inventory_set_updated_at on public.inventory_items;
create trigger inventory_set_updated_at before update on public.inventory_items
for each row execute function public.set_updated_at();

alter table public.inventory_items enable row level security;

drop policy if exists "public read inventory" on public.inventory_items;
create policy "public read inventory" on public.inventory_items
for select using (active = true or public.is_admin());

drop policy if exists "admin manage inventory" on public.inventory_items;
create policy "admin manage inventory" on public.inventory_items
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Replace generic parking/storage addons with exact inventory selection in the public configurator.
-- We keep the rows for backwards compatibility, but mark them inactive.
update public.addons
set active = false
where project_id = (select id from public.projects where slug = 'monterra-residence')
  and category in ('parking','storage');

with p as (select id from public.projects where slug = 'monterra-residence')
insert into public.inventory_items(project_id, code, type, name, description, building, floor, area, price, status, active)
select p.id, v.code, v.type, v.name, v.description, v.building, v.floor, v.area, v.price, v.status, true
from p
cross join (values
  ('G-101','parking','Miejsce postojowe G-101','Garaż podziemny · blisko klatki A','A',-1,null,45000,'available'),
  ('G-102','parking','Miejsce postojowe G-102','Garaż podziemny · szerokie miejsce','A',-1,null,49000,'available'),
  ('G-103','parking','Miejsce postojowe G-103','Garaż podziemny · przy windzie','A',-1,null,52000,'reserved'),
  ('G-104','parking','Miejsce postojowe G-104','Garaż podziemny · standardowe','A',-1,null,45000,'available'),
  ('G-105','parking','Miejsce postojowe G-105','Garaż podziemny · miejsce poszerzone','A',-1,null,52000,'available'),
  ('G-201','parking','Miejsce postojowe G-201','Garaż podziemny · klatka B','B',-1,null,45000,'available'),
  ('G-202','parking','Miejsce postojowe G-202','Garaż podziemny · klatka B','B',-1,null,45000,'sold'),
  ('G-203','parking','Miejsce postojowe G-203','Garaż podziemny · klatka B','B',-1,null,49000,'available'),
  ('P-01','parking','Miejsce naziemne P-01','Parking zewnętrzny',null,0,null,25000,'available'),
  ('P-02','parking','Miejsce naziemne P-02','Parking zewnętrzny',null,0,null,25000,'available'),
  ('P-03','parking','Miejsce naziemne P-03','Parking zewnętrzny',null,0,null,25000,'reserved'),
  ('P-04','parking','Miejsce naziemne P-04','Parking zewnętrzny',null,0,null,25000,'available'),
  ('K-01','storage','Komórka K-01','Komórka lokatorska 3,2 m²','A',-1,3.2,14500,'available'),
  ('K-02','storage','Komórka K-02','Komórka lokatorska 4,2 m²','A',-1,4.2,18000,'available'),
  ('K-03','storage','Komórka K-03','Komórka lokatorska 5,1 m²','A',-1,5.1,22000,'sold'),
  ('K-04','storage','Komórka K-04','Komórka lokatorska 3,8 m²','A',-1,3.8,16500,'available'),
  ('K-05','storage','Komórka K-05','Komórka lokatorska 4,6 m²','B',-1,4.6,19500,'available'),
  ('K-06','storage','Komórka K-06','Komórka lokatorska 5,4 m²','B',-1,5.4,23500,'reserved'),
  ('K-07','storage','Komórka K-07','Komórka lokatorska 2,9 m²','B',-1,2.9,13000,'available'),
  ('K-08','storage','Komórka K-08','Komórka lokatorska 4,0 m²','B',-1,4.0,17500,'available')
) as v(code,type,name,description,building,floor,area,price,status)
on conflict (project_id, code) do update set
  type = excluded.type,
  name = excluded.name,
  description = excluded.description,
  building = excluded.building,
  floor = excluded.floor,
  area = excluded.area,
  price = excluded.price,
  status = excluded.status,
  active = true;

-- Ensure public insert policy still accepts website leads with the new columns.
drop policy if exists "public create leads" on public.leads;
create policy "public create leads" on public.leads for insert to anon, authenticated
with check (status = 'new' and source = 'website');

-- Helpful additional construction item for the admin/news section.
with p as (select id from public.projects where slug = 'monterra-residence')
insert into public.construction_updates(project_id, title, body, progress, published, published_at)
select p.id, 'Montaż stolarki okiennej', 'Kolejny etap prac w budynkach A i B.', 68, true, now()
from p
where not exists (
  select 1 from public.construction_updates cu
  where cu.project_id = p.id and cu.title = 'Montaż stolarki okiennej'
);
