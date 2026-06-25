import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']!
const supabaseKey = process.env['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY']!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Report = {
  id: string
  cedula_hash: string
  name: string
  age_approximate: number
  latitude: number
  longitude: number
  contact_phone?: string
  contact_email?: string
  contact_whatsapp?: string
  status: 'alive' | 'missing' | 'found'
  message?: string
  created_at: string
  updated_at: string
}

export type Match = {
  report_id_1: string
  report_id_2: string
  cedula_hash: string
  created_at: string
}
