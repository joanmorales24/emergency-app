'use client'

import { useEffect, useState } from 'react'
import { MapView } from '@/components/MapView'
import { ReportForm } from '@/components/ReportForm'
import { Report, supabase } from '@/lib/supabase'
import { hashCedula } from '@/lib/hash'

export default function Home() {
  const [reports, setReports] = useState<Report[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showMatches, setShowMatches] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [searchCedula, setSearchCedula] = useState('')
  const [matches, setMatches] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchReports()

    const channel = supabase
      .channel('reports-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        () => {
          fetchReports()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReports(data as Report[])
    } catch (err) {
      console.error('Error fetching reports:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchMatches = async () => {
    if (!searchCedula.trim()) {
      setMessage({ type: 'error', text: 'Ingresa una cédula para buscar' })
      return
    }

    const cedulaHash = hashCedula(searchCedula)
    const found = reports.filter(r => r.cedula_hash === cedulaHash)

    if (found.length === 0) {
      setMessage({ type: 'error', text: 'No hay reportes para esta cédula' })
      setMatches([])
    } else {
      setMatches(found)
      setShowMatches(true)
      setMessage({
        type: 'success',
        text: `¡Encontramos ${found.length} reporte(s) para esta persona!`
      })
    }
  }

  const handleReportSuccess = () => {
    setShowForm(false)
    setMessage({
      type: 'success',
      text: '✅ Reporte guardado exitosamente. Gracias por ayudar.'
    })
    setTimeout(() => fetchReports(), 500)
  }

  const handleReportError = (error: string) => {
    setMessage({
      type: 'error',
      text: `❌ Error: ${error}`
    })
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">🆘 EMERGENCIA VENEZUELA</h1>
        <p className="text-center text-sm mt-1">Inventario de personas con vida</p>
      </header>

      {/* Messages */}
      {message && (
        <div
          className={`p-4 text-center font-semibold text-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="ml-4 text-sm underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Map Section */}
        <div className="flex-1 min-h-[40vh] md:min-h-full relative">
          {loading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <p className="text-gray-600 text-lg">Cargando mapa...</p>
            </div>
          ) : (
            <MapView
              reports={reports}
              onReportClick={(report) => {
                setSelectedReport(report)
              }}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-96 bg-white shadow-lg overflow-y-auto">
          {showForm ? (
            <>
              <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold">Nuevo Reporte</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-2xl font-bold text-gray-500"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <ReportForm
                  onSuccess={handleReportSuccess}
                  onError={handleReportError}
                />
              </div>
            </>
          ) : showMatches ? (
            <>
              <div className="p-4 border-b sticky top-0 bg-white z-10">
                <button
                  onClick={() => setShowMatches(false)}
                  className="text-blue-600 underline font-semibold mb-3"
                >
                  ← Volver
                </button>
                <h2 className="text-xl font-bold">
                  Coincidencias Encontradas ({matches.length})
                </h2>
              </div>

              <div className="p-4 space-y-4">
                {matches.map((report) => (
                  <div
                    key={report.id}
                    className="border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedReport(report)}
                  >
                    <p className="text-xl font-bold">{report.name}</p>
                    <p className="text-gray-600">{report.age_approximate} años</p>
                    <p className="mt-2">
                      <span className={`px-3 py-1 rounded text-white text-sm font-bold ${
                        report.status === 'alive' ? 'bg-green-600' :
                        report.status === 'missing' ? 'bg-red-600' :
                        'bg-blue-600'
                      }`}>
                        {report.status === 'alive' ? 'CON VIDA' :
                         report.status === 'missing' ? 'DESAPARECIDO/A' :
                         'ENCONTRADO/A'}
                      </span>
                    </p>
                    {report.message && (
                      <p className="text-sm text-gray-700 mt-2">{report.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : selectedReport ? (
            <>
              <div className="p-4 border-b sticky top-0 bg-white z-10">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-blue-600 underline font-semibold mb-3"
                >
                  ← Volver
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedReport.name}</h2>
                  <p className="text-xl text-gray-600 mb-4">
                    {selectedReport.age_approximate} años
                  </p>

                  <p className="mb-4">
                    <span className={`px-4 py-2 rounded text-white text-base font-bold ${
                      selectedReport.status === 'alive' ? 'bg-green-600' :
                      selectedReport.status === 'missing' ? 'bg-red-600' :
                      'bg-blue-600'
                    }`}>
                      {selectedReport.status === 'alive' ? '✅ CON VIDA' :
                       selectedReport.status === 'missing' ? '❌ DESAPARECIDO/A' :
                       '✓ ENCONTRADO/A'}
                    </span>
                  </p>

                  {selectedReport.message && (
                    <div className="bg-gray-100 p-3 rounded-lg mb-4">
                      <p className="font-semibold text-sm text-gray-600 mb-1">
                        Información adicional:
                      </p>
                      <p className="text-base">{selectedReport.message}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">
                      Reportado: {new Date(selectedReport.created_at).toLocaleDateString('es-VE')}
                    </p>

                    {selectedReport.contact_phone && (
                      <a
                        href={`tel:${selectedReport.contact_phone}`}
                        className="block bg-blue-600 text-white py-3 rounded-lg font-bold text-center text-lg hover:bg-blue-700 transition"
                      >
                        📞 {selectedReport.contact_phone}
                      </a>
                    )}

                    {selectedReport.contact_whatsapp && (
                      <a
                        href={`https://wa.me/${selectedReport.contact_whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-green-600 text-white py-3 rounded-lg font-bold text-center text-lg hover:bg-green-700 transition"
                      >
                        💬 WhatsApp
                      </a>
                    )}

                    {selectedReport.contact_email && (
                      <a
                        href={`mailto:${selectedReport.contact_email}`}
                        className="block bg-purple-600 text-white py-3 rounded-lg font-bold text-center text-lg hover:bg-purple-700 transition"
                      >
                        ✉️ Email
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Search & Buttons */}
              <div className="p-4 space-y-3 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                  Total de reportes: {reports.length}
                </h2>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Buscar persona por cédula:
                  </p>
                  <input
                    type="text"
                    value={searchCedula}
                    onChange={(e) => setSearchCedula(e.target.value)}
                    placeholder="V-123456789"
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-lg font-bold"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSearchMatches()
                    }}
                  />
                  <button
                    onClick={handleSearchMatches}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-700 transition"
                  >
                    🔍 Buscar Coincidencias
                  </button>
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition"
                >
                  ➕ Reportar Persona
                </button>

                <button
                  onClick={() => fetchReports()}
                  className="w-full bg-gray-400 text-white py-3 rounded-lg font-bold hover:bg-gray-500 transition"
                >
                  🔄 Actualizar
                </button>
              </div>

              {/* Reports List */}
              <div className="p-4 space-y-3">
                {reports.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No hay reportes aún. Sé el primero en reportar.
                  </p>
                ) : (
                  reports.map((report) => (
                    <div
                      key={report.id}
                      className="border-2 border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition"
                      onClick={() => setSelectedReport(report)}
                    >
                      <p className="font-bold text-lg">{report.name}</p>
                      <p className="text-gray-600 text-base">{report.age_approximate} años</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-white text-xs font-bold ${
                        report.status === 'alive' ? 'bg-green-600' :
                        report.status === 'missing' ? 'bg-red-600' :
                        'bg-blue-600'
                      }`}>
                        {report.status === 'alive' ? 'CON VIDA' :
                         report.status === 'missing' ? 'DESAPARECIDO/A' :
                         'ENCONTRADO/A'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-3 text-sm">
        <p>Esta aplicación es 100% para fines humanitarios • Datos protegidos con encriptación</p>
      </footer>
    </div>
  )
}
