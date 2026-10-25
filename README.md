# THINKGEARS Electronics store (Next.js + PostgreSQL + Paystack) — UNTESTED
Setup: `npm install`; copy `.env.example` to `.env.local` and fill it in; run `db/schema.sql` then optionally `db/seed.sql` on your Postgres (Neon/Supabase); `npm run dev`.
Admin: /admin (password = ADMIN_PASSWORD). Add products with photos, edit, remove, change order status. Prices entered in ₦.
Paystack: use TEST secret key; webhook URL `https://YOURDOMAIN/api/paystack/webhook`. Deploy on Vercel (add the same env vars).
Not included: customer accounts/wishlist, discount codes, shipping zones (flat SHIPPING_FLAT_KOBO only), emails, reviews, abandoned-order stock release, admin rate limiting.
Before live orders: real contact details/policies in app/layout.tsx, live Paystack keys, test paid/failed/abandoned payments, delete sample products.
