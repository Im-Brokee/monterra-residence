# Monterra Residence — Next.js + Supabase + Vercel

Gotowy starter pod stronę sprzedażową inwestycji deweloperskiej w Polsce.

## Co już działa

- responsywna strona główna w stylu Monterra Residence,
- katalog mieszkań + filtry,
- 10 różnych typów planów i stylów wnętrz,
- możliwość obsługi 100+ mieszkań z Supabase (seed tworzy 124 lokale),
- karta mieszkania,
- przełącznik: Rzut 2D / Widok 3D / Spacer po mieszkaniu,
- konfigurator ceny:
  - miejsce postojowe w garażu,
  - miejsce naziemne,
  - komórka lokatorska,
  - Smart Home+,
  - wykończenie Comfort / Premium,
- automatyczne przeliczanie ceny końcowej,
- formularz zapytania zapisujący wybraną konfigurację,
- panel `/admin` do zmiany statusu i ceny,
- automatyczna historia ceny w PostgreSQL,
- RLS w Supabase,
- wersja demo działa bez Supabase na lokalnych danych.

---

## 1. Uruchom lokalnie

W katalogu projektu:

```bash
npm install
npm run dev
```

Otwórz:

```text
http://localhost:3000
```

Bez `.env.local` strona działa na demo danych.

---

## 2. Załóż projekt Supabase

1. Wejdź do Supabase i utwórz nowy projekt.
2. Otwórz `SQL Editor`.
3. Uruchom po kolei:
   - `supabase/01_schema.sql`
   - `supabase/02_seed.sql`
4. Seed utworzy:
   - projekt Monterra Residence,
   - 10 typów planów,
   - 124 lokale,
   - parkingi / komórkę / Smart Home / pakiety wykończenia,
   - przykładowy postęp budowy.

---

## 3. Podłącz Next.js do Supabase

W Supabase otwórz `Connect` i skopiuj:

- Project URL
- Publishable key

Utwórz plik `.env.local` w głównym katalogu projektu:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TWOJ-PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TWOJ_PUBLISHABLE_KEY
```

Uruchom ponownie:

```bash
npm run dev
```

Od tej chwili strona będzie czytać dane z Supabase zamiast z demo danych.

Nigdy nie wrzucaj `.env.local` do GitHub. Jest już w `.gitignore`.

---

## 4. Utwórz konto administratora

1. Supabase → Authentication → Users → Add user.
2. Ustaw swój e-mail i hasło.
3. Skopiuj UUID utworzonego użytkownika.
4. Otwórz `supabase/03_make_admin.sql`.
5. Wstaw UUID zamiast:

```text
PASTE_AUTH_USER_UUID_HERE
```

6. Uruchom SQL.
7. Wejdź na:

```text
http://localhost:3000/admin/login
```

Po zalogowaniu możesz zmieniać ceny i statusy mieszkań.

Zmiana `price` automatycznie tworzy wpis w `price_history`.

---

## 5. Wrzuć projekt na GitHub

### Opcja A — Terminal

Najpierw utwórz pusty repository na GitHub, np. `monterra-residence`.

Potem w terminalu w katalogu projektu:

```bash
git init
git add .
git commit -m "Initial Monterra Residence platform"
git branch -M main
git remote add origin https://github.com/TWOJ_LOGIN/monterra-residence.git
git push -u origin main
```

### Przy kolejnych zmianach

```bash
git add .
git commit -m "Update apartment platform"
git push
```

---

## 6. Podłącz GitHub do Vercel

1. Vercel → `New Project`.
2. Wybierz repository `monterra-residence` z GitHub.
3. Vercel powinien automatycznie wykryć Next.js.
4. Przed deployem dodaj Environment Variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Warto dodać je do:

- Production
- Preview
- Development

5. Kliknij Deploy.

Po każdym `git push` Vercel zrobi nowy deployment. Branch `main` może być produkcją, a pozostałe branche dostają preview deploymenty.

---

## 7. Jak wszystko jest połączone

```text
Klient
  ↓
Next.js
  ↓
Supabase Data API
  ↓
PostgreSQL
```

### Publiczna strona

`apartments` → lista mieszkań / cena / status

`layout_types` → plan 2D / 3D / spacer / styl

`addons` → parking / komórka / pakiety

`leads` ← formularz klienta

### Panel administratora

Supabase Auth → logowanie administratora

`admin_profiles` → sprawdza czy użytkownik ma dostęp

Admin zmienia:

```text
price
status
```

Trigger PostgreSQL zapisuje zmianę ceny do:

```text
price_history
```

---

## 8. Gdzie podmienić prawdziwe wizualizacje

Aktualne pliki demo są tutaj:

```text
/public/demo/floorplans
/public/demo/cutaways
/public/demo/rooms
```

Dla prawdziwego klienta możesz:

### Najprościej

Podmienić SVG/JPG/WEBP w `public/`.

### Lepiej dla realnej inwestycji

Utworzyć w Supabase Storage bucket, np.:

```text
apartments
```

i w `layout_types` zapisać publiczne URL-e do:

- `floorplan_url`
- `cutaway_url`
- `tour_rooms`

Kod strony nie będzie wymagał przebudowy.

---

## 9. Prawdziwy spacer 360°

Obecny `Spacer po mieszkaniu` jest gotowym UI i systemem przechodzenia między pomieszczeniami.

Na etapie realnego klienta zamieniasz grafiki z `tour_rooms` na:

- panoramy 360°,
- renderowane sceny,
- albo integrację z dedykowanym viewerem WebGL.

Struktury bazy i strony nie trzeba wtedy zmieniać.

---

## 10. Ważne przed prawdziwym uruchomieniem

Do portfolio obecna wersja jest wystarczająca. Dla realnego dewelopera warto jeszcze dodać:

- CAPTCHA/Turnstile na formularzu leadów,
- politykę prywatności / RODO,
- legalne dokumenty i prospekt,
- eksport wymaganych danych cenowych,
- Storage na zdjęcia i PDF-y,
- logi zmian administratorów,
- backupy,
- e-mail / CRM notification po nowym leadzie,
- monitoring i analitykę.
