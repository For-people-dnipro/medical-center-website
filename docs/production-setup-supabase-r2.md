# Production Setup: Supabase + Cloudflare + R2

This guide is tailored to this repository:

- frontend: Vite/React in the repo root
- backend: Strapi in `/clinic-backend`
- email: Resend
- recommended production stack:
  - database: Supabase Postgres
  - DNS/CDN: Cloudflare
  - media storage: Cloudflare R2

## 1. Target architecture

- `forpeople.com.ua` -> frontend
- `www.forpeople.com.ua` -> frontend
- `api.forpeople.com.ua` -> Strapi
- `mail.forpeople.com.ua` -> verified sender subdomain for Resend
- media files -> Cloudflare R2 bucket, referenced by Strapi upload provider

## 2. Before you start

Prepare access to:

- HOSTiQ account for `forpeople.com.ua`
- Cloudflare account
- Supabase account
- Resend account
- deployment target for Strapi
- deployment target for frontend

Prepare local backups:

- copy `/clinic-backend/.tmp/data.db` if it exists
- copy `/clinic-backend/public/uploads`
- copy your current `.env` files

## 3. Move DNS to Cloudflare

1. Create a Cloudflare account.
2. Add `forpeople.com.ua`.
3. Cloudflare will scan existing DNS records.
4. Review imported records carefully before continuing.
5. Cloudflare will give you 2 nameservers.
6. In HOSTiQ, open the domain NS settings and replace the current nameservers with the Cloudflare nameservers.
7. Wait until Cloudflare marks the zone as `Active`.

Notes:

- DNS propagation can take from a few minutes to several hours.
- Do not change random DNS records during nameserver propagation unless you understand which DNS panel is authoritative at that moment.

## 4. Verify Resend sender domain

Recommended sender:

- `For People <noreply@mail.forpeople.com.ua>`

In Resend:

1. Open `Domains`.
2. Add `mail.forpeople.com.ua`.
3. Copy the DNS records shown by Resend.

In DNS:

Add the records one by one. If your DNS provider already appends the zone name automatically, enter only the host part, for example:

- `resend._domainkey.mail`
- `send.mail`
- `_dmarc`

After the records propagate:

1. Return to Resend.
2. Wait for the domain to become `Verified`.
3. Keep these backend env values:

```env
RESEND_FROM_EMAIL=For People <noreply@mail.forpeople.com.ua>
RESEND_TO_EMAIL=clinic@example.com
RESEND_REPLY_TO_EMAIL=clinic@example.com
```

## 5. Create Supabase project

1. Create a new Supabase project.
2. Pick a nearby region.
3. Save the database password in your password manager.
4. Open `Connect`.
5. Copy the `Session pooler` connection string.

Why the session pooler:

- it supports IPv4 and IPv6
- it is the safer default for a long-running app if you do not know whether your hosting supports IPv6 direct DB access

Expected format:

```text
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

## 6. Configure Strapi for Supabase

This repository is already prepared for Postgres in:

- `/clinic-backend/config/database.ts`

The backend env file should look like:

```env
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
DATABASE_HOST=aws-0-[REGION].pooler.supabase.com
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres.xxxxx
DATABASE_PASSWORD=your_database_password
DATABASE_SCHEMA=public
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

Important:

- keep `DATABASE_SSL=true`
- for Supabase, `DATABASE_SSL_REJECT_UNAUTHORIZED=false` is the practical default unless you explicitly configure CA verification

## 7. Install backend dependencies

Already prepared in this repository:

- `pg`
- `@strapi/provider-upload-aws-s3`

No additional package install is needed for this repo before switching env values.

## 8. Create Cloudflare R2 bucket

1. In Cloudflare, open `R2`.
2. Create a bucket, for example `forpeople-media`.
3. Open R2 API token management.
4. Create a token with `Object Read & Write`.
5. Restrict the token to the target bucket if possible.
6. Save:
   - Access Key ID
   - Secret Access Key
   - bucket name
   - endpoint URL

Expected endpoint format:

```text
https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

## 9. Configure Strapi for R2

This repository is already prepared for conditional upload providers in:

- `/clinic-backend/config/plugins.ts`

For production, set:

```env
UPLOAD_PROVIDER=aws-s3
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxx
AWS_ACCESS_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=auto
AWS_BUCKET=forpeople-media
AWS_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
AWS_ACL=public-read
AWS_SIGNED_URL_EXPIRES=900
```

Optional later:

```env
CDN_URL=https://media.forpeople.com.ua
CDN_ROOT_PATH=
```

Notes:

- `UPLOAD_PROVIDER=local` remains the default for local development.
- Switching to `aws-s3` only affects environments where you set that env value.

## 10. Migrate media from local uploads to R2

Current local upload folder:

- `/clinic-backend/public/uploads`

Safe sequence:

1. Back up the entire folder.
2. First deploy Strapi with the R2 provider enabled.
3. Confirm that a newly uploaded test image lands in R2.
4. Only then migrate old files.

Recommended migration approach:

1. Export content and media metadata from Strapi.
2. Upload the old files to the same provider structure used by the new upload provider.
3. Re-import or resync metadata if needed.
4. Check media URLs in the admin panel and on the frontend.

Practical warning:

- moving files manually without validating the file records can break media references
- do not delete local uploads until the admin panel and site both serve migrated assets correctly

## 11. Migrate SQLite data to Supabase Postgres

Current local database:

- `/clinic-backend/.tmp/data.db`

Safe migration sequence:

1. Stop Strapi.
2. Back up `data.db`.
3. Back up `/clinic-backend/public/uploads`.
4. Set the Postgres env values.
5. Start Strapi against the new Postgres database.
6. Recreate/import content into Postgres.
7. Validate content types, relations, and media records.

Because Strapi project structures vary, treat this as a controlled migration, not an in-place DB engine swap.

Validate these content types after migration:

- doctors
- branches
- specialisations
- news
- services / prices
- homepage content
- vacancies
- upload files

## 12. Deploy backend

Backend requirements:

- Node 20+
- access to Supabase
- access to Cloudflare R2
- environment variables from `.env`

Run on the server:

```bash
npm ci
npm run build
npm run start
```

Recommended backend domain:

- `api.forpeople.com.ua`

In Cloudflare DNS:

- point `api` to your backend server or platform target

## 13. Deploy frontend

Frontend production env should include:

```env
VITE_API_URL=https://api.forpeople.com.ua
VITE_SITE_URL=https://forpeople.com.ua
VITE_GOOGLE_MAPS_KEY=...
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Then:

```bash
npm ci
npm run build
```

Deploy the generated `dist` folder to your frontend host.

Recommended DNS:

- `forpeople.com.ua` -> frontend host
- `www.forpeople.com.ua` -> frontend host

## 14. Production verification checklist

### Backend

- Strapi admin opens
- content types load
- create/edit content works
- contact form sends via Resend
- new uploads land in R2

### Frontend

- homepage works
- news pages load
- doctor pages load
- maps load
- forms submit successfully
- analytics consent works

### SEO

- `robots.txt` available
- `sitemap.xml` available
- dynamic news/doctor pages generated during build

### DNS / email

- Resend domain verified
- SPF present
- DKIM present
- DMARC present

## 15. Backup plan

### Database

At minimum:

- periodic SQL dump
- keep dump copies outside the server

### Media

At minimum:

- keep the original local uploads backup until production is stable
- keep periodic R2 export or secondary copy for critical assets

### Config

Back up:

- production env values
- DNS records
- Strapi config files

## 16. Cost expectations

Typical starter setup:

- Cloudflare DNS: free
- Cloudflare R2: often near zero at small scale, then pay-as-you-go
- Supabase Free: free, but limited and not ideal long-term for mission-critical production

Practical recommendation:

- start on Supabase Free if budget is strict
- plan to move to a paid database tier once the site is live and relied upon
