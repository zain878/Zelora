-- Zelorà — Phase 6 migration: multi-product orders (shopping cart)
-- Run this once in the Supabase SQL editor, AFTER supabase/orders.sql has
-- already been run. It does NOT delete or touch any existing order rows —
-- it only loosens a few columns and adds new structure alongside them.
--
-- Why this is needed:
-- Phase 4's `orders` table assumed exactly one product per order, so
-- product_id/product_name/product_price/quantity live directly on the
-- orders row. Phase 6 adds a shopping cart, so one order can now contain
-- several different products. Rather than cramming multiple products into
-- one row (or a text blob), we add a new `order_items` table: one row per
-- product in an order, linked back to the parent order by `order_id`.
--
-- Existing single-product orders are NOT migrated into order_items — they
-- simply keep their product details on the `orders` row exactly as before,
-- so they remain fully readable in the Table Editor. Only new orders
-- (placed after this migration) leave those four columns empty and use
-- order_items instead.

-- -----------------------------------------------------------------------
-- 1. Loosen the old per-order product columns
-- -----------------------------------------------------------------------
-- New orders won't set these anymore (their products live in order_items
-- instead), so they can no longer be required. Existing rows are
-- untouched — their values stay exactly as they are.

alter table public.orders
  alter column product_id drop not null,
  alter column product_name drop not null,
  alter column product_price drop not null,
  alter column quantity drop not null;

-- The old "quantity >= 1" check only makes sense when quantity is set at
-- all; allow it to be null (new multi-item order) or a positive number
-- (legacy single-item order). The default auto-generated name for an
-- inline column check is "<table>_<column>_check".
alter table public.orders
  drop constraint if exists orders_quantity_check;

alter table public.orders
  add constraint orders_quantity_check
    check (quantity is null or quantity >= 1);

-- -----------------------------------------------------------------------
-- 2. New table: order_items (one row per product in an order)
-- -----------------------------------------------------------------------

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,

  -- Same "snapshot" reasoning as orders/reviews: the line item stays
  -- readable even if src/data/products.js changes later.
  product_id integer not null,
  product_name text not null,
  product_price numeric(10, 2) not null check (product_price >= 0),
  quantity integer not null check (quantity >= 1),

  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;

-- No SELECT/INSERT/UPDATE/DELETE policies at all for order_items — see
-- part 4 below for why direct table access is intentionally closed off.

-- -----------------------------------------------------------------------
-- 3. Tighten orders: remove the old direct-insert policy
-- -----------------------------------------------------------------------
-- Phase 4 let the public key INSERT directly into `orders`. Now that an
-- order can span several products, a single client-side insert can't
-- create the order row AND its order_items atomically — if the
-- order_items insert failed partway through, you'd be left with an empty
-- "orphan" order and no clean way to retry without duplicating it. So
-- instead, all new orders go through one function (below) that creates
-- the order and all of its items together, as a single all-or-nothing
-- transaction. The public key no longer needs — or gets — direct insert
-- access to either table.

drop policy if exists "Anyone can submit an order" on public.orders;

-- -----------------------------------------------------------------------
-- 4. The checkout function
-- -----------------------------------------------------------------------
-- `security definer` means this function runs with the permissions of the
-- account that created it (you, via the SQL editor) rather than the
-- caller's — that's what lets it insert into orders/order_items even
-- though the public key has no direct policy to do so on either table.
-- This is the standard, safe Postgres pattern for "let the public do
-- exactly this one controlled thing, nothing else." Because the whole
-- function body runs as one transaction, if any insert fails partway
-- through (e.g. a bad item), everything it did so far is rolled back —
-- there is no way to end up with a half-created order.

create or replace function public.create_order(
  p_customer_name text,
  p_phone text,
  p_email text,
  p_city text,
  p_address text,
  p_notes text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_item jsonb;
begin
  if p_customer_name is null or btrim(p_customer_name) = '' then
    raise exception 'Full name is required';
  end if;
  if p_phone is null or btrim(p_phone) = '' then
    raise exception 'Phone number is required';
  end if;
  if p_city is null or btrim(p_city) = '' then
    raise exception 'City is required';
  end if;
  if p_address is null or btrim(p_address) = '' then
    raise exception 'Delivery address is required';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'At least one cart item is required';
  end if;

  insert into public.orders (customer_name, phone, email, city, address, notes, status)
  values (
    p_customer_name,
    p_phone,
    nullif(btrim(coalesce(p_email, '')), ''),
    p_city,
    p_address,
    nullif(btrim(coalesce(p_notes, '')), ''),
    'new'
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    insert into public.order_items (order_id, product_id, product_name, product_price, quantity)
    values (
      v_order_id,
      (v_item->>'product_id')::integer,
      v_item->>'product_name',
      (v_item->>'product_price')::numeric,
      (v_item->>'quantity')::integer
    );
  end loop;

  return v_order_id;
end;
$$;

-- Anyone using the public key may call this function — but only this
-- function. They still cannot query, edit, or delete orders/order_items
-- directly; the function is the sole door in.
grant execute on function public.create_order(text, text, text, text, text, text, jsonb) to anon;
