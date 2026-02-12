
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables - Check .env.local')
}

// Fallback to prevent crash on module load, but requests will fail if env vars are missing
export const supabase = createClient(
  supabaseUrl || 'https://missing-url.supabase.co',
  supabaseServiceRoleKey || 'missing-key'
)
