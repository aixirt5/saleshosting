import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mjqoupaicusadawbadla.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcW91cGFpY3VzYWRhd2JhZGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NjYxMzEsImV4cCI6MjA2MDM0MjEzMX0.MShJ0H9pDwNhXzDKrOMzrcx1cjyroeVJGV7XWRJE9u0'

export const supabase = createClient(supabaseUrl, supabaseKey) 