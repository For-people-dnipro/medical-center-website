# clinic-backend

Strapi 5 CMS для сайту медичного центру «Для Людей». Постачає контент (лікарі, послуги, новини, вакансії, банер головної) для React-фронтенду через REST API. Деплой на Railway, медіа — у Cloudflare R2.

- Strapi: `5.31.0`
- Node: `>=20.0.0`, npm: `>=10.0.0`
- БД: SQLite (dev) / PostgreSQL (prod)
- Upload provider: local (dev) / AWS S3-сумісний R2 (prod)

---

## Швидкий старт (локально)

```bash
npm install
cp .env.example .env   # заповнити секрети — див. розділ Env vars
npm run develop
```

Адмінка: <http://localhost:1337/admin>. Перший запуск створює суперюзера.

Скрипти:
- `npm run develop` — dev із autoReload
- `npm run start` — production-режим
- `npm run build` — збірка адмінки
- `npm run strapi -- <command>` — CLI Strapi

---

## Content-types

Усі — у `src/api/<name>/content-types/<name>/schema.json`. `draftAndPublish` увімкнено скрізь, окрім `theme`.

### Collection types

| Type | Singular / Plural | Призначення | Ключові поля |
|---|---|---|---|
| **Doctor** | `doctor` / `doctors` | Картки лікарів | `name`, `surname`, `positionLong*`, `slug`, `order*`, `startYear*`, `photo*` (media), relations: `specialisations` (M:N), `branch` (M:1); blocks: `education`, `experienceSection`, `services`; `quote`, `show_on_homepage`, `homepage_priority`, `seo` (component `shared.seo`) |
| **Specialisation** | `specialisation` / `specialisations` | Спеціалізації лікарів | `name*`, `slug` (uid від name), `order`, `isActive` |
| **Branch** | `branch` / `branches` | Філії клініки | `name*`, `slug*`, `address`, `hours`, `phone`, `map_link`, `lat`, `lng`, `order`, `isActive` |
| **Service Price** | `service-price` / `service-prices` | Прайс по сторінках | `title*`, `page*` enum: `consultation \| diagnostics \| manipulation`, `priceForDeclarant`, `priceForNonDeclarant*`, `isFreeForDeclarant*`, `order*`, `isActive*` |
| **News** | `news-item` / `news` (collection `news_items`) | Новини / статті | `title*`, `slug*`, `short_description`, `content` (dynamic zone: `news.text-block`, `news.highlight-block`), `cover_image`, `theme` (M:1), `published_date`, `seo_title`, `seo_description` |
| **Theme** | `theme` / `themes` | Категорії новин | `name*`, `slug*`, `description` |
| **Vacancy** | `vacancy` / `vacancies` | Вакансії | `title*`, `location*`, `shortSchedule*`, `fullSchedule`, `importantForUs*` (blocks), `weProvide*` (blocks), `description`, `isActive`, `order*` |
| **Home Slider** | `home-slider` / `home-sliders` | Слайди банера на головній | `photodesktop*`, `photomobile*`, `buttonEnabled`, `buttonText`, `buttonLink`, `buttonColor`, `order` |
| **Contact** | `contact` / `contacts` | Заявки з контактної форми (приймає POST з фронту, лист через Resend) | див. `src/api/contact/` |

### Single types

| Type | Призначення |
|---|---|
| **Homepage** (`homepage`) | Конфіг головної сторінки. Поле `featured_doctors` (1:M → `doctor`) — список лікарів, що показуються в секції «Наші лікарі» |

### Components

- `shared.seo` — використовується у `doctor.seo`
- `news.text-block`, `news.highlight-block` — dynamic zone для `news.content`

---

## Env vars

Файл `.env` у корені `clinic-backend/`. **Жодне реальне значення не повинне потрапити в git** — `.env` має бути у `.gitignore` (якщо там є приклад — переїхати у `.env.example`).

### Strapi core

| Var | Обов'язкове | Опис |
|---|---|---|
| `HOST` | – | default `0.0.0.0` |
| `PORT` | – | default `1337` |
| `APP_KEYS` | ✅ | масив через кому, для сесій |
| `API_TOKEN_SALT` | ✅ | сіль для API-токенів |
| `ADMIN_JWT_SECRET` | ✅ | JWT адмінки |
| `TRANSFER_TOKEN_SALT` | ✅ | сіль для transfer-токенів |
| `ENCRYPTION_KEY` | ✅ | шифрування секретних полів |
| `JWT_SECRET` | ✅ | JWT users-permissions plugin |
| `API_CACHE_TTL_MS` | – | TTL кастомного `api-cache` middleware (default `60000`) |

### База даних

| Var | Опис |
|---|---|
| `DATABASE_CLIENT` | `sqlite` (dev) \| `postgres` (prod) \| `mysql` |
| `DATABASE_URL` | повний URL Postgres (Railway/Supabase надає) — має пріоритет |
| `DATABASE_HOST` / `DATABASE_PORT` / `DATABASE_NAME` / `DATABASE_USERNAME` / `DATABASE_PASSWORD` | альтернатива `DATABASE_URL` |
| `DATABASE_SCHEMA` | default `public` (Postgres) |
| `DATABASE_SSL` | `true` для Supabase/Railway |
| `DATABASE_SSL_REJECT_UNAUTHORIZED` | зазвичай `false` для managed Postgres |
| `DATABASE_FILENAME` | шлях до SQLite-файлу (default `.tmp/data.db`) |

### Upload (R2 / S3)

| Var | Опис |
|---|---|
| `UPLOAD_PROVIDER` | `local` (default) \| `aws-s3` |
| `AWS_ACCESS_KEY_ID` | R2 access key |
| `AWS_ACCESS_SECRET` | R2 secret |
| `AWS_REGION` | default `auto` для R2 |
| `AWS_ENDPOINT` | `https://<account>.r2.cloudflarestorage.com` |
| `AWS_BUCKET` | назва R2-бакета |
| `AWS_ACL` | default `public-read` |
| `AWS_SIGNED_URL_EXPIRES` | default `900` сек |
| `CDN_URL` | публічний URL бакета (напр. `https://pub-7bbc3c2ba7f44ae5865d2230f3c7f008.r2.dev`) — переписує URL у відповідях API |
| `CDN_ROOT_PATH` | опц. префікс у бакеті |

### Email (Resend)

Кастомний контролер у `src/api/contact/` шле листи через Resend API.

| Var | Опис |
|---|---|
| `RESEND_API_KEY` | API-ключ Resend |
| `RESEND_FROM_EMAIL` | адреса відправника (домен має бути верифікованим у Resend) |
| `RESEND_TO_EMAIL` | куди надсилати заявки |
| `RESEND_REPLY_TO_EMAIL` | reply-to |

---

## Public permissions

Фронт ходить без токена → ролі **Public** (`users-permissions`) треба видати `find` / `findOne` на:

- `doctor`, `specialisation`, `branch`
- `news`, `theme`
- `service-price`
- `vacancy`
- `home-slider`
- `homepage` (single — `find`)

І `create` на `contact` (форма зворотного зв'язку).

Налаштовується вручну: **Settings → Users & Permissions Plugin → Roles → Public**. Не забути натиснути **Save**. Після зміни `content-types` пермішени для нових ендпойнтів потрібно ставити заново.

> Якщо після деплою фронт отримує `403 Forbidden` від `/api/...` — у 99% випадків це не оновлені public permissions на проді.

---

## База даних: SQLite ↔ Postgres (Supabase / Railway)

### Локально (SQLite)
```env
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```
Файл живе у `.tmp/data.db`. Не комітити.

### Production (Postgres на Railway або Supabase)
```env
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

Railway підставляє `DATABASE_URL` автоматично, якщо до проекту прив'язано Postgres-plugin. Для Supabase треба взяти connection string з **Project Settings → Database → Connection string → URI** (формат `postgresql://postgres:[pass]@db.<ref>.supabase.co:5432/postgres`).

> **Не змішувати SQLite-дамп з Postgres-схемою.** Дані переносити лише через `strapi export` / `strapi import` або SQL-дамп з конверсією — пряме копіювання `.db` у Postgres не спрацює.

---

## Uploads / Cloudflare R2

Production-uploads йдуть у R2 через S3-сумісний драйвер. Конфіг — `config/plugins.ts`.

Кроки налаштування R2:
1. Створити бакет у Cloudflare R2.
2. Згенерувати API token (Object Read & Write) — отримаєш `Access Key ID` + `Secret Access Key`.
3. У Settings бакета увімкнути **Public access** (R2.dev subdomain) → скопіювати public URL → це `CDN_URL`.
4. Endpoint — `https://<account_id>.r2.cloudflarestorage.com`.
5. У Strapi: `UPLOAD_PROVIDER=aws-s3` + усі `AWS_*` змінні (див. вище).
6. У `config/middlewares.ts` R2 hostname вже додано до CSP (`img-src`, `media-src`). Якщо змінюється — оновити там.

Responsive breakpoints для генерації варіантів (`config/plugins.ts`):
`xlarge=1600`, `large=1200`, `medium=768`, `small=480`, `xsmall=64`.

Upload settings у Strapi store (виставляються при bootstrap, `src/index.ts`):
- `sizeOptimization: true`
- `responsiveDimensions: true`
- `autoOrientation: true`
- `aiMetadata: false`

---

## Міграції / перенос даних

Strapi 5 не має повноцінних SQL-міграцій. Зміни схеми автоматично застосовуються при старті (тільки у `develop`-режимі; у `start` — БД має бути сумісна, інакше падає).

Робочий процес:
1. **Локально (dev)** — змінюєш content-type через адмінку або редагуєш `schema.json` → перезапуск Strapi оновлює БД.
2. **Коміт** змін у `src/api/<name>/content-types/.../schema.json` + згенеровані типи у `types/generated/` (за бажанням).
3. **Деплой** — на проді при старті Strapi застосовує schema diff до Postgres.

### Експорт / імпорт контенту

```bash
# Зняти локальний дамп → файл .tar.gz.enc
npm run strapi -- export --file backup

# Імпорт у іншу інстанцію
npm run strapi -- import --file backup.tar.gz.enc
```

У репо вже лежить `backup.tar.gz` та папка `backups/` — це ручні дампи; для регулярних бекапів варто додати cron на Railway або Supabase scheduled backups.

### Transfer (production ↔ local)
```bash
# Тягнути prod у локальну БД
npm run strapi -- transfer --from https://<prod>/admin --from-token <transfer_token>

# Push з локалі у prod (обережно)
npm run strapi -- transfer --to https://<prod>/admin --to-token <transfer_token>
```
Transfer-токени створюються у **Settings → Transfer Tokens**.

### Breaking-зміни схеми
- Перейменування поля = drop + create (Strapi не робить rename автоматично). Обхід: створити нове поле, перенести дані SQL-міграцією вручну, видалити старе.
- Видалення обов'язкового поля з даними — у Postgres впаде. Спершу зробити optional → деплой → міграція → видалення.

---

## Деплой (Railway)

- `railway.json` + `nixpacks.toml` — конфіг збірки.
- Build: `npm install && npm run build`
- Start: `npm run start`
- Обов'язково виставити **усі** env vars зі списку вище у Railway Variables.
- Postgres-plugin Railway автоматично надає `DATABASE_URL`.
- `DATABASE_SSL=true`, `DATABASE_SSL_REJECT_UNAUTHORIZED=false`.

---

## Структура проєкту

```
config/          # database, plugins, middlewares, server, admin
src/
  api/           # content-types + controllers + routes + services
  components/    # shared components (news.*, shared.seo)
  middlewares/   # api-cache.ts (кастомний кеш GET-запитів)
  extensions/    # розширення плагінів
  index.ts       # bootstrap: дефолтні upload settings
types/generated/ # автогенеровані TS-типи
public/uploads/  # локальні аплоади (dev; у prod порожньо — все в R2)
database/        # SQLite файли (dev)
```

---

## Поширені проблеми

| Симптом | Причина / фікс |
|---|---|
| `403` на `/api/<x>` з фронту | Public permission не виданий — Settings → Roles → Public |
| Картинки 404 на проді | `UPLOAD_PROVIDER` не `aws-s3`, або `CDN_URL` не виставлений |
| Адмінка CSP блокує R2 | Додати домен у `config/middlewares.ts` → `img-src`/`media-src` |
| Strapi не стартує після зміни schema на проді | Несумісна зміна — відкат або ручна SQL-міграція |
| SQLite `database is locked` локально | Закрити інші процеси `strapi develop` |
