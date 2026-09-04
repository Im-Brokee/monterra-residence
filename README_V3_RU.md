Monterra v3 — premium redesign + lightweight animations + performance polish

Что внутри:
- новый premium-стиль главной и каталога;
- более дорогой hero-блок;
- улучшенные карточки квартир;
- более красивый каталог и compact hero на странице /mieszkania;
- более мягкие анимации без тяжелых библиотек;
- оптимизация через lazy loading изображений и content-visibility.

Как установить:
1. Распакуй архив.
2. Замени файлы в своем проекте `monterra-residence`.
3. Выполни:
   git add .
   git commit -m "Monterra v3 premium redesign"
   git push
4. Vercel сам пересоберет сайт.

Файлы в обновлении:
- app/layout.tsx
- app/page.tsx
- app/mieszkania/page.tsx
- app/globals.css
- components/ApartmentCard.tsx
