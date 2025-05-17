import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    // Log the actual values for debugging (we'll remove this after testing)
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Key Length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length)
    console.log('Key Prefix:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 4))

    const { data, error } = await supabase
      .from('myusers')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Supabase Error:', error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Unexpected Error:', error)
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 })
  }
} 