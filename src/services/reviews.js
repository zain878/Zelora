// All database logic for reviews lives here — components never talk to
// Supabase directly.
import { supabase } from '../lib/supabaseClient.js'

// Fetches the approved reviews for one product, newest first. RLS already
// restricts the public client to status = 'approved' rows only — this
// query narrows further to just this product.
export async function fetchApprovedReviews(productId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, customer_name, rating, review, created_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Stores a new review as 'pending'. Returns { error } only — like
// submitOrder, this intentionally skips .select() after .insert(): a
// freshly submitted review is 'pending', and the public SELECT policy
// only allows reading 'approved' rows, so asking Supabase to hand the
// inserted row back would fail RLS even though the insert itself worked.
export async function submitReview({
  productId,
  productName,
  customerName,
  rating,
  review,
}) {
  const { error } = await supabase.from('reviews').insert({
    product_id: productId,
    product_name: productName,
    customer_name: customerName,
    rating,
    review,
    // status is left out on purpose — it defaults to 'pending' in the
    // database, and the RLS policy only allows inserts where it's 'pending'.
  })

  return { error }
}
