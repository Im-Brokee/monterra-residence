# Monterra v4 — real images + premium animation

Это обновление заменяет схематичные блоки реальными визуализациями и добавляет легкие анимации без сторонних animation-библиотек.

## Что изменено
- настоящий фотореалистичный дом на первом экране;
- премиальный hero с Ken Burns motion и light sweep;
- секция визуализаций: общий вид + вход;
- интерактивный выбор этажа поверх реального изображения здания;
- карточки квартир теперь с интерьерными визуализациями и мини-2D планом;
- блок 2D/3D/spacer использует новые интерьерные изображения;
- отдельная галерея салона, спальни, ванной на странице квартиры;
- страница /mieszkania получила реальный фон комплекса;
- локация больше не выглядит как пустой schematic mockup;
- легкие scroll-reveal эффекты через IntersectionObserver;
- изображения переведены в WebP (~1.2 MB на весь новый набор);
- Next/Image оптимизирует hero/gallery на Vercel;
- content-visibility + lazy loading для тяжелых секций.

## Установка поверх существующего репозитория
Распакуй update и скопируй содержимое в корень `monterra-residence` с заменой.

Потом:

```bash
git add .
git commit -m "Monterra v4 real media premium redesign"
git push
```

Vercel сам запустит deployment.

## Supabase
Так как твоя база уже создана, один раз выполни в Supabase SQL Editor:

`supabase/05_premium_media.sql`

Он поменяет изображения виртуального тура в `layout_types` на новые WebP-файлы сайта.

## Важные файлы
- app/page.tsx
- app/mieszkania/page.tsx
- app/mieszkania/[slug]/page.tsx
- app/globals.css
- components/ApartmentCard.tsx
- components/BuildingSelector.tsx
- components/Reveal.tsx
- lib/demo-data.ts
- public/media/*
- supabase/05_premium_media.sql
