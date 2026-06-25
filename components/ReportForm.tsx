'use client'

import { useState } from 'react'
import { hashCedula } from '@/lib/hash'
import { supabase } from '@/lib/supabase'

interface ReportFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function ReportForm({ onSuccess, onError }: ReportFormProps) {
  const [step, setStep] = useState<'location' | 'form'>('location')
  const [locationMethod, setLocationMethod] = useState<'auto' | 'manual' | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    cedula: '',
    name: '',
    ageApproximate: '',
    latitude: '',
    longitude: '',
    address: '',
    contactPhone: '',
    contactEmail: '',
    contactWhatsapp: '',
    status: 'alive',
    message: '',
  })

  const handleLocationAuto = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          })
          setStep('form')
        },
        (error) => {
          onError?.('Error al obtener ubicación. Intenta manual.')
          setLocationMethod('manual')
        }
      )
    } else {
      onError?.('Geolocalización no disponible')
      setLocationMethod('manual')
    }
  }

  const handleLocationManual = () => {
    setLocationMethod('manual')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const cedulaHash = hashCedula(formData.cedula)

      const { error } = await supabase.from('reports').insert({
        cedula_hash: cedulaHash,
        name: formData.name,
        age_approximate: parseInt(formData.ageApproximate),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        contact_phone: formData.contactPhone || null,
        contact_email: formData.contactEmail || null,
        contact_whatsapp: formData.contactWhatsapp || null,
        status: formData.status,
        message: formData.message || null,
      })

      if (error) throw error

      onSuccess?.()
      setFormData({
        cedula: '',
        name: '',
        ageApproximate: '',
        latitude: '',
        longitude: '',
        address: '',
        contactPhone: '',
        contactEmail: '',
        contactWhatsapp: '',
        status: 'alive',
        message: '',
      })
      setStep('location')
      setLocationMethod(null)
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Error al guardar reporte')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'location' && locationMethod === null) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">¿Dónde está la persona?</h2>
          <p className="text-gray-600 mb-6 text-center text-base">
            Elige cómo proporcionar la ubicación
          </p>

          <button
            onClick={handleLocationAuto}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold mb-4 text-lg hover:bg-blue-700 transition"
          >
            📍 Usar mi ubicación actual
          </button>

          <button
            onClick={handleLocationManual}
            className="w-full bg-gray-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-700 transition"
          >
            🗺️ Ingresar ubicación manualmente
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 mb-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Reportar Persona</h2>

      {locationMethod === 'manual' && (
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
          <p className="text-sm text-gray-700">
            📍 Debes ingresar una ubicación. Si solo tienes ciudad/zona, usaremos el centro de esa área.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-lg font-semibold mb-2">
            Cédula de Identidad
          </label>
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleInputChange}
            placeholder="V-123456789"
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-bold"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            ⚠️ Esta información se protege con encriptación
          </p>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nombre completo"
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">Edad (aproximada)</label>
          <input
            type="number"
            name="ageApproximate"
            value={formData.ageApproximate}
            onChange={handleInputChange}
            placeholder="35"
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg"
            required
          />
        </div>

        {locationMethod === 'manual' && (
          <>
            <div>
              <label className="block text-lg font-semibold mb-2">Ubicación / Ciudad</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="ej: Caracas, Barrio XXX"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold mb-2">Latitud</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="10.5"
                  step="0.0001"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">Longitud</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="-66.5"
                  step="0.0001"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg"
                  required
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              💡 Busca en Google Maps: abre la ubicación, haz clic en las coordenadas y cópialas
            </p>
          </>
        )}

        <div>
          <label className="block text-lg font-semibold mb-2">Estado</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg"
          >
            <option value="alive">Con vida</option>
            <option value="missing">Desaparecido/a</option>
            <option value="found">Encontrado/a</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">
            ¿Cómo puedes ser contactado/a?
          </label>
          <p className="text-sm text-gray-600 mb-3">Selecciona al menos una opción</p>

          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            placeholder="Teléfono (ej: 0412-1234567)"
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg mb-3"
          />

          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            placeholder="Email (ej: correo@example.com)"
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg mb-3"
          />

          <input
            type="tel"
            name="contactWhatsapp"
            value={formData.contactWhatsapp}
            onChange={handleInputChange}
            placeholder="WhatsApp (ej: +58412-1234567)"
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg mb-3"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">
            Información adicional (opcional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Descripción física, ubicación donde fue visto por última vez, etc."
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg h-24"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Guardando...' : '📤 Enviar Reporte'}
        </button>
      </div>
    </form>
  )
}
