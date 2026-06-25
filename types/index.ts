export interface Report {
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

export interface Location {
  latitude: number
  longitude: number
}

export interface ContactOptions {
  phone?: string
  email?: string
  whatsapp?: string
}
