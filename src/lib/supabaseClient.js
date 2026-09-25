// A single Supabase client, created once and reused everywhere.
//
// Only the public "anon" key is used here — that's safe to ship in the
// browser bundle because it's designed to be public. What actually
// protects the data is Row Level Security on the database side (see
// supabase/orders.sql), not secrecy of this key. The far more powerful
// "service_role" key must NEVER appear in frontend code.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfaces a clear message during local development instead of a
  // confusing failure deep inside a Supabase call later.
  console.error(
    'Missing Supabase environment variables. Copy .env.example to .env ' +
      'and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
