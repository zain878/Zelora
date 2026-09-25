# Zelorà

React + Vite build of the Zelorà website. Phase 6 adds a shopping cart,
multi-product checkout, real business info, and production polish.

## Run locally

```bash
npm install
cp .env.example .env   # then fill in your Supabase project's values
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Supabase setup

Run these SQL files in the Supabase SQL Editor, **in this order**, each
once:

1. `supabase/orders.sql` — creates the `orders` table (Phase 4).
2. `supabase/reviews.sql` — creates the `reviews` table (Phase 5).
3. `supabase/migration_multi_item_orders.sql` — adds multi-product order
   support (Phase 6). This does NOT delete any existing orders — see the
   comments at the top of that file for exactly what it changes and why.

Then, Settings -> API in your Supabase project, copy the **Project URL**
and the **anon / public** key (never `service_role`), and put them in your
local `.env` (copied from `.env.example`):
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
Restart `npm run dev` if it was already running, so Vite picks up the new
environment variables. `.env` is gitignored — never commit real
credentials; `.env.example` only shows the variable names.

## Business information

Real Instagram/WhatsApp links live in one place: `src/config/site.js`.
Change them there — Navbar, Footer, and the order confirmation page all
read from that file, nothing is duplicated.

## Adding a real product

Product data lives entirely in `src/data/products.js` — no other files
need to change. To add one:

1. Add the photo file to `src/assets/products/` (e.g. `bridal-set.jpg`).
2. Import it at the top of `products.js`:
   ```js
   import bridalSet from '../assets/products/bridal-set.jpg'
   ```
3. Add one object to the `products` array using that import as `image`,
   filling in `name`, `category`, `price`, `description`, `available`
   (and `featured: true` if it should also appear on the homepage).
4. Save — it appears automatically in Shop, its category filter, its own
   product page, the cart, and checkout.

Until real photos are ready, `image` values point at placehold.co
placeholder URLs, which work exactly the same way as a local import from
the rest of the app's point of view.

## The shopping cart

Cart state lives in `src/context/CartContext.jsx` (React Context, no extra
library) and is mirrored to the browser's `localStorage` so it survives a
refresh. It's per-browser, not shared across devices — there are no user
accounts. Checking out calls a single Postgres function
(`create_order`, see the migration file) that creates one `orders` row and
all of its `order_items` together as one all-or-nothing transaction.

## Build for production

```bash
npm run build
npm run preview
```

## Notes

- No user accounts, authentication, online payments, or admin dashboard —
  orders/reviews are managed from the Supabase dashboard directly.
- Reviews stay pending until manually approved in Supabase's Table Editor;
  only approved reviews are ever readable by the public key (enforced by
  Row Level Security, not just app logic).
