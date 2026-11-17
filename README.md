# 🍔 FoodoraX

Food delivery platform for Jagiroad, Assam — built around students, hostels, gym users and Assamese food.

## Project status (honest)

This repository is an **early foundation, not a finished app**. Nothing here has been run against a database or deployed.

| Part | State |
|---|---|
| `apps/server/prisma/schema.prisma` | Written (users, restaurants, menu, orders, payments, coupons, reviews, subscriptions, notifications, delivery partners, banners, **FoodoraX Air** drone tables). **Not yet validated with `prisma validate` or migrated.** |
| `docs/API.md` | Full REST + Socket.io contract for the planned backend and web app. |
| `prototypes/customer-app-prototype.jsx` | Single-file React **UI prototype** (mock data, no backend): home, search, restaurant, cart, tracking, orders, profile, restaurant/delivery/admin dashboards. |
| `prototypes/extended-modules-prototype.jsx` | UI prototype: auth/OTP screen, notifications, coupons, meal plans, group orders, fitness, Assamese menu, addresses, referrals, settings. |
| `prototypes/backend-reference-sketch.jsx` | **Unfinished sketch** of backend code kept in comments. Contains known bugs (e.g. discount computed before subtotal exists, OTP not verified against a store). Do **not** deploy it; it's reference only. |
| Express API, Next.js 15 app, seed, Docker, CI | **Not built yet.** |

## Planned stack
Next.js 15 · TypeScript · Tailwind · Framer Motion · Zustand · Express · Prisma · PostgreSQL (Supabase) · Socket.io · Razorpay · Cloudinary · Vercel + Railway/Render.

## Next steps
1. `apps/server`: implement the API in `docs/API.md` (server-side pricing, JWT, rate limiting, Razorpay signature check, Socket.io auth).
2. `apps/web`: Next.js app using the prototypes as the visual reference.
3. Migration + idempotent seed; deployment guide.

## Security note
Never commit secrets. Use `.env` files (git-ignored) and platform environment variables.
