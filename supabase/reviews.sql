-- Zelorà — Phase 5: customer reviews
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),

  -- Snapshot fields, same reasoning as orders.product_id/product_name:
  -- the review stays meaningful even if products.js changes later.
  product_id integer not null,
  product_name text not null,

  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  review text not null,

  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),

  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------
-- Once enabled, every operation is denied by default until a policy
-- explicitly allows it. We add exactly two policies for the public key:
--
-- 1. INSERT — anyone can submit a review, but it can only ever be
--    inserted as 'pending'. There's no way for a customer to self-approve
--    or self-reject through the app.
-- 2. SELECT — anyone can read reviews, but ONLY where status = 'approved'.
--    Pending and rejected reviews are invisible to the public client no
--    matter what a request asks for.
--
-- There is no UPDATE or DELETE policy at all for the public key, so
-- customers can never edit, delete, or change the status of any review —
-- their own or anyone else's. Approving/rejecting happens from the
-- Supabase dashboard (Table Editor), using your own project session.

alter table public.reviews enable row level security;

create policy "Anyone can submit a review"
  on public.reviews
  for insert
  to anon
  with check (status = 'pending');

create policy "Anyone can read approved reviews"
  on public.reviews
  for select
  to anon
  using (status = 'approved');
