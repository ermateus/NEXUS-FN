import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    // Return a dummy client during build or if variables are missing
    // to prevent crashing the entire application build process.
    return {} as any;
  }
  
  return createBrowserClient(url, key)
}
