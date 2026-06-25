import CryptoJS from 'crypto-js'

const HASH_SECRET = 'emergency-app-venezuela-terremoto-2026'

export function hashCedula(cedula: string): string {
  return CryptoJS.SHA256(cedula + HASH_SECRET).toString()
}

export function generateReportId(): string {
  return 'report_' + Math.random().toString(36).substring(2, 11)
}
