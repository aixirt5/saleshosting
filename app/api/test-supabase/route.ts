import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
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