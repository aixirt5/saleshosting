'use client'

import { useEffect } from 'react'

export default function TestPage() {
  useEffect(() => {
    console.log('Environment Variables Test:')
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('SUPABASE_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }, [])

  return (
    <div className="p-4">
      <h1>Environment Variables Test</h1>
      <p>Check your browser console for environment variable values.</p>
    </div>
  )
} 