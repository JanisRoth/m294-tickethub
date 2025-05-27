import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bxysodmffralcelmbegm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eXNvZG1mZnJhbGNlbG1iZWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjU5OTcsImV4cCI6MjA2MzkwMTk5N30.aoWBN3arZD-ILm3yijYP1e8sCToCXcJA0xY187biS6g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
