# НАЧНИ ОТСЮДА

## Самый короткий порядок действий

### 1. Сначала проверь сайт на Mac

Открой Terminal и перейди в папку проекта:

```bash
cd /путь/к/monterra-residence
npm install
npm run dev
```

Открой `http://localhost:3000`.

Пока Supabase не подключён, сайт автоматически показывает встроенные демо-данные.

Перед первым пушем обязательно проверь production build:

```bash
npm run build
```

---

### 2. Создай НОВЫЙ проект Supabase

Для этого демо лучше не использовать production-базу салона.

В Supabase:

1. New project.
2. SQL Editor → New query.
3. Открой файл `supabase/01_schema.sql`, вставь весь текст → Run.
4. Открой `supabase/02_seed.sql`, вставь весь текст → Run.

После этого в базе будут таблицы:

- `projects`
- `layout_types`
- `apartments`
- `addons`
- `leads`
- `price_history`
- `admin_profiles`
- `construction_updates`

Seed создаёт 10 разных планировок и 124 квартиры.

---

### 3. Возьми два ключа Supabase

Supabase → Connect.

Нужны только:

```text
Project URL
Publishable key
```

В корне проекта создай `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=ТВОЙ_PROJECT_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=ТВОЙ_PUBLISHABLE_KEY
```

НЕ используй secret/service_role key в браузере и НЕ пушь `.env.local` в GitHub.

Перезапусти:

```bash
npm run dev
```

Теперь каталог уже берёт квартиры из Supabase.

---

### 4. Сделай себе доступ в админку

Supabase → Authentication → Users → Add user.

Создай свой email + password.

Скопируй UUID пользователя.

Открой:

```text
supabase/03_make_admin.sql
```

Замени:

```text
PASTE_AUTH_USER_UUID_HERE
```

на UUID из Auth и нажми Run.

Потом:

```text
http://localhost:3000/admin/login
```

В админке изменение цены автоматически создаёт запись в `price_history`.

---

### 5. GitHub

На GitHub создай пустой private/public repository `monterra-residence`.

В Terminal:

```bash
git init
git add .
git commit -m "Initial Monterra Residence platform"
git branch -M main
git remote add origin https://github.com/ТВОЙ_LOGIN/monterra-residence.git
git push -u origin main
```

Проверь, что `.env.local` в GitHub НЕТ.

---

### 6. Vercel

Vercel → New Project → Import Git Repository → выбери `monterra-residence`.

Добавь Environment Variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Лучше включить их для Production + Preview + Development.

Нажми Deploy.

После этого схема такая:

```text
GitHub
   ↓ каждый push
Vercel / Next.js
   ↓
Supabase
   ├─ квартиры
   ├─ цены
   ├─ статусы
   ├─ дополнения
   ├─ заявки
   └─ история цен
```

---

## Где что менять

### Дизайн

```text
app/globals.css
```

### Главная

```text
app/page.tsx
```

### Каталог квартир

```text
app/mieszkania/page.tsx
components/ApartmentCatalog.tsx
```

### Страница конкретной квартиры

```text
app/mieszkania/[slug]/page.tsx
```

### 2D / 3D / виртуальный тур

```text
components/ApartmentExperience.tsx
```

### Парковка / кладовка / отделка + автоматическая цена

```text
components/ApartmentConfigurator.tsx
```

### Форма заявки

```text
components/LeadForm.tsx
```

### Админка

```text
components/AdminDashboard.tsx
```

### SQL

```text
supabase/
```

---

## Визуализации

Сейчас в проекте лежат 10 разных демо-планов и 10 cutaway-визуализаций:

```text
public/demo/floorplans/
public/demo/cutaways/
```

А изображения комнат для `Spacer`:

```text
public/demo/rooms/
```

Когда появятся настоящие 3D-рендеры/панорамы — подменяем URL в `layout_types`. Логику сайта переписывать не надо.

В `public/reference/` также лежат четыре визуальных mockup-а дизайна, которые были сгенерированы перед кодом.
