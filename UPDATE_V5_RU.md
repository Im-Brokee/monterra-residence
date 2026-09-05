MONTERRA V5 — premium redesign patch

Что исправлено:
1. Карточки квартир — теперь используются разные визуалы для разных квартир.
2. Блок «Architektura...» — исправлены значения (3 min / 2 и т.д.), карточки сделаны дороже визуально.
3. 2D планы — полностью заменены SVG-файлы на более чистые и «девелоперские» планы под каждую квартиру.
4. 3D вид — заменены SVG cutaway на более премиальные isometric/cutaway визуалы под каждую квартиру.
5. История цены — полностью переделана: нормальные значения, понятный график, актуальная цена, последняя смена и список обновлений.
6. Детальная страница квартиры — hero, галерея и похожие квартиры теперь используют разные визуалы.
7. Spacer / room rail — комнаты подтягиваются через визуальные пресеты по типу квартиры.

Что загрузить в проект:
- app/globals.css
- app/mieszkania/[slug]/page.tsx
- app/page.tsx
- components/ApartmentCard.tsx
- components/PriceHistory.tsx
- lib/data.ts
- lib/demo-data.ts
- lib/visuals.ts
- public/demo/floorplans/*.svg
- public/demo/cutaways/*.svg
- public/media/variants/*.webp

SQL НЕ НУЖЕН.
Достаточно заменить файлы, сделать commit и push.
