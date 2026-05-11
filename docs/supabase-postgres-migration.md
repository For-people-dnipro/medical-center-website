# SQLite -> Supabase Postgres Migration

This guide migrates the Strapi backend from the current local SQLite database to Supabase Postgres while keeping uploads local.

## What stays the same

- uploads stay in `/clinic-backend/public/uploads`
- upload provider stays `local`
- frontend does not need to change yet

## What changes

- Strapi database moves from SQLite to Supabase Postgres

## Current local database

- `/clinic-backend/.tmp/data.db`

## Safe migration strategy

Use Strapi's built-in `export` and `import` commands.

Why:

- safer than trying to manually transform SQLite into Postgres
- includes content, schemas, and optionally files
- easier to validate and roll back

## Step 1. Back up the current project state

Back up these locations before any DB switch:

- `/clinic-backend/.tmp/data.db`
- `/clinic-backend/public/uploads`
- `/clinic-backend/.env`

## Step 2. Create a Strapi export from SQLite

From `/clinic-backend`:

```bash
npm run strapi -- export --file backups/strapi-sqlite-export --no-encrypt
```

This produces a compressed export file without interactive encryption prompts.

If `backups/` does not exist, create it first:

```bash
mkdir -p backups
```

Recommended export for this project:

- do not exclude files
- keep content, schemas, config, and files together for the first migration pass

## Step 3. Create Supabase project

In Supabase:

1. Create a new project.
2. Save the DB password.
3. Open `Connect`.
4. Copy the `Session pooler` connection string.

Recommended region:

- closest to your production audience

## Step 4. Update backend env for Postgres

In `/clinic-backend/.env`, replace the database section with:

```env
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
DATABASE_HOST=aws-0-[REGION].pooler.supabase.com
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres.xxxxx
DATABASE_PASSWORD=YOUR_PASSWORD
DATABASE_SCHEMA=public
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

UPLOAD_PROVIDER=local
DATABASE_FILENAME=.tmp/data.db
```

Notes:

- `UPLOAD_PROVIDER=local` stays unchanged
- `DATABASE_FILENAME` can remain present; it will be ignored once `DATABASE_CLIENT=postgres`
- use the `Session pooler`, not the direct connection string, unless you explicitly know you want direct access

## Step 5. Start Strapi against Supabase

From `/clinic-backend`:

```bash
npm run develop
```

What to verify:

- Strapi boots successfully
- admin panel opens
- no database connection errors

At this point, the Postgres database will still be empty.

## Step 6. Import the exported SQLite content into Supabase

From `/clinic-backend`:

```bash
npm run strapi -- import --file backups/strapi-sqlite-export.tar.gz --force
```

Important:

- the filename extension depends on the actual generated export file
- use the exact filename created by `strapi export`

If your export command generated another extension, use that exact file path.

## Step 7. Restart Strapi after import

After import finishes:

1. stop Strapi if it is still running
2. start it again

```bash
npm run develop
```

## Step 8. Validate the migrated content

Check these areas in the admin panel:

- doctors
- branches
- specialisations
- news
- homepage
- services / prices
- vacancies
- uploaded files

Check these areas on the frontend:

- homepage sections
- doctors listing
- doctor profile pages
- news listing
- news detail pages
- branch pages

## Step 9. Keep SQLite until everything is confirmed

Do not delete:

- `/clinic-backend/.tmp/data.db`
- `/clinic-backend/public/uploads`

until:

- Strapi works on Supabase
- all content types open correctly
- the frontend reads the migrated content correctly

## Step 10. Rollback plan

If anything goes wrong:

1. restore the old database settings in `/clinic-backend/.env`
2. set:

```env
DATABASE_CLIENT=sqlite
DATABASE_SSL=false
DATABASE_FILENAME=.tmp/data.db
```

3. restart Strapi

This returns the backend to the previous SQLite state.
