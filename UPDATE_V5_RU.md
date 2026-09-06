# Monterra Residence — V5 Portfolio Upgrade

Эта версия продолжает V4 и сохраняет существующую логику квартир, Supabase, админки, конфигуратора цены и истории цен.

## Что добавлено

- полноценное мобильное меню вместо скрытия навигации;
- телефон отдела продаж в desktop header;
- live-индикатор продаж и количества доступных квартир в hero;
- ипотечный калькулятор с ценой, первоначальным взносом, сроком и процентной ставкой;
- быстрые фильтры 1–5 комнат над каталогом;
- floating CTA на публичных страницах: звонок, запрос, каталог;
- на карточке квартиры: печатная/PDF-версия через системный Print → Save as PDF и native Share/копирование ссылки;
- отдельная 404-страница;
- SEO metadata + Open Graph;
- robots.txt / sitemap с динамическими URL квартир;
- print styles для аккуратной карточки квартиры;
- зафиксированы production dependencies вместо `latest`.

## Зафиксированные версии

- Next.js 16.3.4
- React / React DOM 19.2.8
- @supabase/ssr 0.12.6
- @supabase/supabase-js 2.115.0
- Node.js >= 22

## Перед production deploy

1. `npm install`
2. `npm run build`
3. проверить `.env.local` / Vercel Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. на demo без Supabase сайт продолжит использовать встроенные demo-data.
5. при реальном домене заменить `https://monterra-residence.pl` в `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`.

## Важно

Локальная среда агента в этой сессии не смогла скачать npm dependencies (network install timeout), поэтому полный `next build` именно здесь не был завершён. Код V5 сделан поверх ранее рабочей V4, а новые компоненты не меняют схему БД.
