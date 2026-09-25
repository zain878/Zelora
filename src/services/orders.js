// All database logic for orders lives here — components never talk to
// Supabase directly.
import { supabase } from '../lib/supabaseClient.js'
import { parsePrice } from '../utils/price.js'

// Submits a full cart as ONE order. Under the hood this calls a single
// Postgres function (see supabase/migration_multi_item_orders.sql) that
// creates the order row and all of its order_items together as one
// all-or-nothing transaction — the public key has no direct insert access
// to either table, only to this one function.
//
// Returns { error } — the caller (Checkout) decides what to show. Unlike
// the old single-product insert, we don't need to avoid reading the
// result back here: an RPC's return value isn't filtered by table RLS the
// way a table SELECT/RETURNING would be, so `data` (the new order's id)
// is available if ever needed, though callers currently just check error.
export async function submitOrder({ customer, delivery, notes, items }) {
  const { data, error } = await supabase.rpc('create_order', {
    p_customer_name: customer.fullName,
    p_phone: customer.phone,
    p_email: customer.email || null,
    p_city: delivery.city,
    p_address: delivery.address,
    p_notes: notes || null,
    p_items: items.map((item) => ({
      product_id: item.id,
      product_name: item.name,
      product_price: parsePrice(item.price),
      quantity: item.quantity,
    })),
  })

  return { data, error }
}
