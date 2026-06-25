'use client'

import { useState } from 'react'
import { hashCedula } from '@/lib/hash'
import { supabase } from '@/lib/supabase'

interface ReportFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function ReportForm({ onSuccess, onError }: ReportFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cedula: '',
    name: '',
    ageApproximate: '',
    latitude: '',
    longitude: '',
    contactPhone: '',
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
        },
        (error) => {
          onError?.('Error al obtener ubicación. Ingresa manualmente.')
        }
      )
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.latitude || !formData.longitude) {
      onError?.('Falta la ubicación. Toca el botón de ubicación.')
      return
    }

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
        contact_email: null,
        contact_whatsapp: null,
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
        contactPhone: '',
        status: 'alive',
        message: '',
      })
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Error al guardar reporte')
    } finally {
      setLoading(false)
    }
  }

  const hasLocation = formData.latitude && formData.longitude

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">📝 Reportar Persona</h2>

      {/* Ubicación */}
      <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4">
        <button
          type="button"
          onClick={handleLocationAuto}
          className={`w-full py-3 rounded-lg font-bold text-lg transition ${
            hasLocation
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {hasLocation ? '✓ Ubicación asignada' : '📍 Asignar mi ubicación'}
        </button>
      </div>

      {/* Datos básicos */}
      <div>
        <label className="block font-bold mb-2">Cédula</label>
        <input
          type="text"
          name="cedula"
          value={formData.cedula}
          onChange={handleInputChange}
          placeholder="V-123456789"
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-base"
          required
        />
      </div>

      <div>
        <label className="block font-bold mb-2">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Nombre completo"
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-base"
          required
        />
      </div>

      <div>
        <label className="block font-bold mb-2">Edad</label>
        <input
          type="number"
          name="ageApproximate"
          value={formData.ageApproximate}
          onChange={handleInputChange}
          placeholder="35"
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-base"
          required
        />
      </div>

      {/* Estado */}
      <div>
        <label className="block font-bold mb-2">Estado</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-base"
        >
          <option value="alive">✅ Con vida</option>
          <option value="missing">❌ Desaparecido/a</option>
          <option value="found">✓ Encontrado/a</option>
        </select>
      </div>

      {/* Contacto */}
      <div>
        <label className="block font-bold mb-2">Teléfono (para contactarte)</label>
        <input
          type="tel"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleInputChange}
          placeholder="0412-1234567"
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-base"
        />
      </div>

      {/* Información adicional */}
      <div>
        <label className="block font-bold mb-2">Información adicional</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Descripción física, ubicación donde fue visto, etc."
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-base h-20"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !hasLocation}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:bg-gray-400"
      >
        {loading ? 'Enviando...' : '✓ Enviar Reporte'}
      </button>
    </form>
  )
}
