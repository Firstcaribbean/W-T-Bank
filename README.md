# W&T BET Bank

A production-oriented fintech web platform built with Next.js 14, Supabase, Tailwind CSS, and React Query. The repo contains one app with two route groups:

- `/dashboard` for customers
- `/admin` for internal operations

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Supabase Auth + Postgres + RLS
- TanStack Query
- React Hook Form + Zod
- Recharts
- lucide-react
- sonner

## Local Setup

1. Create a Supabase project.
2. Run the SQL migration from `supabase/migrations/001_init.sql`.
3. Run the seed script from `supabase/seed.sql`.
4. Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

5. Install dependencies and run the app:

```bash
npm install
npm run dev
```

6. Open `http://localhost:3000`.

## Supabase Notes

- The schema uses Row Level Security.
- Users can only read/write their own records.
- Admin access is granted through the `profiles.role = 'admin'` policy checks.
- Money movement uses Postgres RPC functions like `transfer_funds`, `pay_bill`, and `buy_airtime`.
- Seed data populates realistic demo users, accounts, transactions, cards, loans, investments, KYC, notifications, exchange rates, and audit logs.

## Environment

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional variables you can add later:

- `NEXT_PUBLIC_SITE_URL`
- `SUPABASE_DB_PASSWORD`

## Project Structure

- `app/(auth)` - login, register, forgot-password
- `app/(user)/dashboard` - customer dashboard and feature pages
- `app/(admin)/admin` - admin dashboard and management pages
- `app/api` - health and analytics endpoints
- `components` - shared UI and dashboard shells
- `lib` - Supabase helpers, auth helpers, mock data, and server data loaders
- `supabase/migrations` - SQL schema and policies
- `supabase/seed.sql` - demo data seed

## Vercel Deploy

1. Push the repo to GitHub.
2. Import the repository into Vercel.
3. Add the same Supabase environment variables in the Vercel project settings.
4. Deploy.
5. Make sure the Supabase project URL and anon key match the environment variables used in production.

## Demo Fallback Mode

If the Supabase environment variables are not present, the app falls back to local demo data so the UI still renders in this workspace.

## Next Steps

- Connect the auth pages to a live Supabase project.
- Run the migration and seed SQL.
- Replace demo-only pages with live queries where desired.
