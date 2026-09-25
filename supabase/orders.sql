-- Zelorà — Phase 4: order storage
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),

  -- Snapshot of the product at order time, so the order stays readable
  -- even if src/data/products.js changes or a product is removed later.
  product_id integer not null,
  product_name text not null,
  product_price numeric(10, 2) not null,

  quantity integer not null check (quantity >= 1),

  customer_name text not null,
  phone text not null,
  email text,

  city text not null,
  address text not null,
  notes text,

  status text not null default 'new'
    check (status in ('new', 'confirmed', 'shipped', 'completed', 'cancelled')),

  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------
-- Once enabled, Postgres denies every operation by default until a policy
-- explicitly allows it. We add exactly one policy: public/anonymous
-- customers may INSERT a new order. There is no SELECT, UPDATE, or DELETE
-- policy for the anon key at all, so the public client can never read,
-- edit, or delete any order — its own or anyone else's — through the app.
-- (You read orders later via the Supabase dashboard/table editor, which
-- uses your own project credentials, not this key.)

alter table public.orders enable row level security;

create policy "Anyone can submit an order"
  on public.orders
  for insert
  to anon
  with check (status = 'new');

-- No policy is created for select/update/delete — they remain blocked
-- for the anon key. If you later build an admin view, add a separate
-- authenticated-only select policy rather than opening this one up.
