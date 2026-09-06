-- Monterra v4: premium media paths for the virtual apartment tour.
-- Safe to run after 01_schema.sql + 02_seed.sql (+ 04_full_sales_upgrade.sql).

update public.layout_types
set tour_rooms = case
  when rooms = 1 then '[
    {"id":"living","name":"Salon z kuchnią","image":"/media/living.webp"},
    {"id":"bathroom","name":"Łazienka","image":"/media/bathroom.webp"}
  ]'::jsonb
  else '[
    {"id":"living","name":"Salon z kuchnią","image":"/media/living.webp"},
    {"id":"bedroom","name":"Sypialnia","image":"/media/bedroom.webp"},
    {"id":"bathroom","name":"Łazienka","image":"/media/bathroom.webp"}
  ]'::jsonb
where project_id is not null;
