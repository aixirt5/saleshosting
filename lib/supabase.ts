import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug logs
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key Length:', supabaseKey?.length)
console.log('Supabase Key Prefix:', supabaseKey?.substring(0, 4))

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables are missing. Some features may not work properly.')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || ''
) 