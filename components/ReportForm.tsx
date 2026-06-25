'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { hashCedula } from '@/lib/hash'
import { supabase } from '@/lib/supabase'

const LocationPicker = dynamic(() => import('./LocationPicker').then((mod) => mod.LocationPicker), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
})

interface ReportFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  onClose?: () => void
}

export function ReportForm({ onSuccess, onError, onClose }: ReportFormProps) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'location' | 'data'>('location')
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

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }))
    // Cambiar a paso de datos automáticamente
    setTimeout(() => setStep('data'), 300)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleChangeLocation = () => {
    setStep('location')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.latitude || !formData.longitude) {
      onError?.('Falta la ubicación. Vuelve al mapa.')
      return
    }

    if (!formData.name.trim()) {
      onError?.('Ingresa el nombre de la persona.')
      return
    }

    if (!formData.ageApproximate) {
      onError?.('Ingresa la edad aproximada.')
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
      setStep('location')
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Error al guardar reporte')
    } finally {
      setLoading(false)
    }
  }

  const hasLocation = formData.latitude && formData.longitude

  // PASO 1: UBICACIÓN
  if (step === 'location') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-3xl font-bold text-gray-900">📍 Ubicación</h2>
              <p className="text-base text-gray-600">
                Toca en el mapa donde está la persona
              </p>
            </div>

            <LocationPicker onLocationSelect={handleLocationSelect} />

            <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
              <p className="text-sm text-gray-700">
                <strong>Consejo:</strong> Haz un zoom en el mapa si necesitas precisión
              </p>
            </div>
          </div>
        </div>

        {/* Botón para cerrar */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-900 py-3 rounded-lg font-bold text-lg hover:bg-gray-400 transition"
          >
            ✕ Cancelar
          </button>
        </div>
      </div>
    )
  }

  // PASO 2: DATOS
  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-3xl font-bold text-gray-900">📝 Datos Personales</h2>
            <p className="text-base text-gray-600">
              Rellena la información de la persona
            </p>
          </div>

          {/* Ubicación confirmada */}
          <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded flex justify-between items-center">
            <p className="text-sm font-bold text-green-700">✓ Ubicación guardada</p>
            <button
              type="button"
              onClick={handleChangeLocation}
              className="text-sm text-green-700 hover:text-green-900 underline font-semibold"
            >
              Cambiar
            </button>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-base font-bold mb-2 text-gray-900">Nombre *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nombre completo"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Edad */}
          <div>
            <label className="block text-base font-bold mb-2 text-gray-900">Edad *</label>
            <input
              type="number"
              name="ageApproximate"
              value={formData.ageApproximate}
              onChange={handleInputChange}
              placeholder="35"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Cédula */}
          <div>
            <label className="block text-base font-bold mb-2 text-gray-900">Cédula</label>
            <input
              type="tel"
              inputMode="numeric"
              name="cedula"
              value={formData.cedula}
              onChange={handleInputChange}
              placeholder="V-123456789"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-base font-bold mb-2 text-gray-900">Estado *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:outline-none bg-white"
            >
              <option value="alive">✅ Con vida</option>
              <option value="missing">❌ Desaparecido/a</option>
              <option value="found">✓ Encontrado/a</option>
            </select>
          </div>

          {/* Contacto */}
          <div>
            <label className="block text-base font-bold mb-2 text-gray-900">Teléfono para contactar</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              placeholder="0412-1234567"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Información adicional */}
          <div>
            <label className="block text-base font-bold mb-2 text-gray-900">Información adicional</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Descripción física, ropa, última ubicación, etc."
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:outline-none h-24"
            />
          </div>
        </div>
      </div>

      {/* Botones sticky al final */}
      <div className="p-4 border-t border-gray-200 bg-white space-y-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:bg-gray-400 touch-none"
        >
          {loading ? '⏳ Enviando...' : '✓ Enviar Reporte'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-gray-300 text-gray-900 py-3 rounded-lg font-bold text-lg hover:bg-gray-400 transition"
        >
          ✕ Cancelar
        </button>
      </div>
    </form>
  )
}
