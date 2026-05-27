# Crimson Dominators

Modern full-scroll Next.js website for the school group Crimson Dominators, with Tailwind CSS, Framer Motion animations, Supabase storage, and a protected admin panel at `/admin`.

## Features

- Responsive public website with hero, about, counters, mission, help cards, gallery, rules, and join form
- Dynamic counters and website text managed from `/admin`
- Join requests stored in Supabase and deletable from admin
- Gallery image records managed from admin
- Server-side Supabase access with a protected HttpOnly admin session
- Vercel-ready environment variables

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a Supabase project.

3. Open Supabase SQL Editor and run:

```sql
-- Use the contents of supabase/schema.sql
```

4. Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-password
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret
```

5. Start the dev server:

```bash
npm run dev
```

6. Visit:

- Public website: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`

## Vercel Deployment

1. Push this project to a Git repository.
2. Import the repository in Vercel as a Next.js project.
3. Add these environment variables in Vercel Project Settings:

```bash
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
```

4. Deploy.

Keep `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` private. The app uses the service role key only on server routes.

## Admin Notes

- Use `/admin` to edit title, subtitle, about text, mission text, counters, and gallery image URLs.
- Join form submissions are stored in `join_submissions`.
- Public gallery items are shown only when `is_visible` is enabled.
- If Supabase is not configured yet, the public website still renders with default Crimson Dominators content, but forms and admin actions need the database.
