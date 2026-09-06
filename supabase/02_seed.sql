-- MON TERRA RESIDENCE — demo seed
-- Run after 01_schema.sql. Safe to rerun: project/layout/addon inserts use ON CONFLICT.

insert into public.projects(slug, name, city, address, handover_quarter, published)
values ('monterra-residence', 'Monterra Residence', 'Poznań', 'ul. Szelągowska 26, Poznań', 'Q2 2028', true)
on conflict (slug) do update set
  name = excluded.name,
  city = excluded.city,
  address = excluded.address,
  handover_quarter = excluded.handover_quarter,
  published = excluded.published;

with p as (select id from public.projects where slug = 'monterra-residence')
insert into public.layout_types(project_id, code, style_name, rooms, area, base_price, floorplan_url, cutaway_url, tour_rooms, sort_order)
select p.id, v.code, v.style_name, v.rooms, v.area, v.base_price, v.floorplan_url, v.cutaway_url, v.tour_rooms::jsonb, v.sort_order
from p
cross join (values
  ('studio-27','Studio Urban',1,27.00,449000,'/demo/floorplans/studio-27.svg','/demo/cutaways/studio-27.svg','[{"id":"living","name":"Salon z kuchnią","image":"/media/living.webp"},{"id":"bathroom","name":"Łazienka","image":"/media/bathroom.webp"}]',1),
  ('compact-34','Soft Minimal',2,34.00,519000,'/demo/floorplans/compact-34.svg','/demo/cutaways/compact-34.svg','[{"id":"living","name":"Salon z kuchnią","image":"/media/living.webp"},{"id":"bedroom","name":"Sypialnia","image":"/media/bedroom.webp"},{"id":"bathroom","name":"Łazienka","image":"/media/bathroom.webp"}]',2),
  ('city-42','Scandinavian',2,42.00,589000,'/demo/floorplans/city-42.svg','/demo/cutaways/city-42.svg','[{"id":"living","name":"Salon z kuchnią","image":"/media/living.webp"},{"id":"bedroom","name":"Sypialnia","image":"/media/bedroom.webp"},{"id":"bathroom","name":"Łazienka","image":"/media/bathroom.webp"}]',3),
  ('family-51','Warm Modern',3,51.00,699000,'/demo/floorplans/family-51.svg','/demo/cutaways/family-51.svg','[{"id":"living","name":"Salon z kuchnią","image":"/media/living.webp"},{"id":"bedroom","name":"Sypialnia","image":"/media/bedroom.webp"},{"id":"bathroom","name":"Łazienka","image":"/media/bathroom.webp"}]',4),
  ('family-58','Natural Beige',3,58.00,785000,'/demo/floorplans/family-58.svg','/demo/cutaways/family-58.svg','[{"id":"living","name":"Salon z kuchnią","image":"/media/living.webp"},{"id":"bedroom","name":"Sypialnia","image":"/media/bedroom.webp"},{"id":"bathroom","name":"Łazienka","image":"/media/bathroom.webp"}]',5),
  ('premium-67','Premium Light',3,67.00,949000,'/demo/floorplans/premium-67.svg','/demo/cutaways/premium-67.svg','[{"id":"living","name":"Salon z kuchnią","image":"/media/living.webp"},{"id":"bedroom","name":"Sypialnia 1","image":"/media/bedroom.webp"},{"id":"bathroom","name":"Łazienka","image":"/media/bathroom.webp"}]',6),
  ('family-76','Family Cozy',4,76.00,1069000,'/demo/floorplans/family-76.svg','/demo/cutaways/family-76.svg','[{"id":"living","name":"Salon z kuchnią","image":"/media/living.webp"},{"id":"bedroom","name":"Sypialnia","image":"/media/bedroom.webp"},{"id":"bathroom","name":"Łazienka","image":"/media/bathroom.webp"}]',7),
  ('premium-88','Elegant Stone',4,88.00,1259000,'/demo/floorplans/premium-88.svg','/demo/cutaways/premium-88.svg','[{"id":"living","name":"Salon z kuchnią","image":"/media/living.webp"},{"id":"bedroom","name":"Sypialnia","image":"/media/bedroom.webp"},{"id":"bathroom","name":"Łazienka","image":"/media/bathroom.webp"}]',8),
  ('apartment-102','Luxury Dark',4,102.00,1499000,'/demo/floorplans/apartment-102.svg','/demo/cutaways/apartment-102.svg','[{"id":"living","name":"Salon z kuchnią","image":"/media/living.webp"},{"id":"bedroom","name":"Sypialnia","image":"/media/bedroom.webp"},{"id":"bathroom","name":"Łazienka","image":"/media/bathroom.webp"}]',9),
  ('penthouse-121','Penthouse Signature',5,121.00,1890000,'/demo/floorplans/penthouse-121.svg','/demo/cutaways/penthouse-121.svg','[{"id":"living","name":"Salon z kuchnią","image":"/media/living.webp"},{"id":"bedroom","name":"Master bedroom","image":"/media/bedroom.webp"},{"id":"bathroom","name":"Łazienka","image":"/media/bathroom.webp"}]',10)
) as v(code,style_name,rooms,area,base_price,floorplan_url,cutaway_url,tour_rooms,sort_order)
on conflict (project_id, code) do update set
  style_name = excluded.style_name,
  rooms = excluded.rooms,
  area = excluded.area,
  base_price = excluded.base_price,
  floorplan_url = excluded.floorplan_url,
  cutaway_url = excluded.cutaway_url,
  tour_rooms = excluded.tour_rooms,
  sort_order = excluded.sort_order;

-- Create 124 demo apartments from 10 distinct layout types.
-- If apartments already exist for this project, this block does nothing because of ON CONFLICT.
with
p as (select id from public.projects where slug = 'monterra-residence'),
lt as (
  select id, code, rooms, area, base_price, sort_order,
         row_number() over(order by sort_order) as rn
  from public.layout_types
  where project_id = (select id from p)
),
g as (
  select i,
         case when i <= 62 then 'A' else 'B' end as building,
         case when i <= 62 then i else i - 62 end as local_i,
         mod(i * 37, 124) + 1 as status_rank
  from generate_series(1,124) as s(i)
),
rows as (
  select g.*, lt.id as layout_type_id, lt.rooms, lt.area, lt.base_price, lt.sort_order,
         floor((g.local_i - 1) / 11.0)::int as floor_no,
         mod(g.local_i - 1, 11) + 1 as unit_in_floor
  from g
  join lt on lt.rn = mod(g.i - 1, 10) + 1
)
insert into public.apartments(
  project_id, layout_type_id, unit_number, slug, building, floor, rooms, area,
  balcony_type, balcony_area, exposure, ceiling_height, status, price, published
)
select
  (select id from p),
  r.layout_type_id,
  r.building || '.' || r.floor_no || '.' || lpad(r.unit_in_floor::text, 2, '0'),
  lower(r.building) || '-' || r.floor_no || '-' || lpad(r.unit_in_floor::text, 2, '0'),
  r.building,
  r.floor_no,
  r.rooms,
  r.area,
  case when r.sort_order = 1 then 'garden' when r.sort_order >= 8 then 'terrace' else 'balcony' end,
  round((case when r.sort_order = 1 then 12.5 else greatest(5.5, r.area * 0.16) end)::numeric, 1),
  case when mod(r.i,2)=0 then 'Południowy zachód' else 'Południowy wschód' end,
  case when r.sort_order >= 9 then 2.90 else 2.70 end,
  case when r.status_rank <= 38 then 'available' when r.status_rank <= 62 then 'reserved' else 'sold' end,
  r.base_price + (r.floor_no * 12000) + (case when r.building='B' then 8000 else 0 end),
  true
from rows r
on conflict (project_id, unit_number) do nothing;

with p as (select id from public.projects where slug = 'monterra-residence')
insert into public.addons(project_id, slug, name, description, category, selection_group, price_type, price_value, sort_order)
select p.id, v.slug, v.name, v.description, v.category, v.selection_group, v.price_type, v.price_value, v.sort_order
from p
cross join (values
  ('miejsce-garazowe','Miejsce postojowe w garażu','Numerowane miejsce w garażu podziemnym.','parking','parking','fixed',45000,1),
  ('miejsce-naziemne','Miejsce postojowe naziemne','Miejsce na parkingu zewnętrznym.','parking','parking','fixed',25000,2),
  ('komorka-lokatorska','Komórka lokatorska 4,2 m²','Prywatna komórka lokatorska blisko garażu.','storage','storage','fixed',18000,3),
  ('smart-home-plus','Pakiet Smart Home+','Sterowanie ogrzewaniem, światłem i roletami.','smart','smart','fixed',9900,4),
  ('wykonczenie-comfort','Wykończenie Comfort','Kompleksowe wykończenie pod klucz.','finish','finish','per_sqm',1100,5),
  ('wykonczenie-premium','Wykończenie Premium','Materiały premium, zabudowy i rozszerzony pakiet wnętrz.','finish','finish','per_sqm',1600,6)
) as v(slug,name,description,category,selection_group,price_type,price_value,sort_order)
on conflict (project_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  selection_group = excluded.selection_group,
  price_type = excluded.price_type,
  price_value = excluded.price_value,
  sort_order = excluded.sort_order,
  active = true;

with p as (select id from public.projects where slug = 'monterra-residence')
insert into public.construction_updates(project_id, title, body, progress, published)
select p.id, 'Stan surowy zamknięty', 'Demo aktualizacji postępu prac.', 62, true
from p
where not exists (
  select 1 from public.construction_updates cu where cu.project_id = p.id
);

-- Seed one initial history point per apartment if it does not already exist.
insert into public.price_history(apartment_id, old_price, new_price, changed_by)
select a.id, null, a.price, null
from public.apartments a
where a.project_id = (select id from public.projects where slug = 'monterra-residence')
and not exists (select 1 from public.price_history ph where ph.apartment_id = a.id);
