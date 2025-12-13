import React, { useState, useEffect } from 'react'

const AdminPanel = ({ user, onClose }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      
      const response = await fetch(`${backendUrl}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('No tienes permisos de administrador')
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full my-8">
        {/* Header */}
        <div className="bg-dark-grey p-6 text-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Panel de Administrador</h2>
              <p className="text-light-grey-dark mt-1">Bienvenido, {user?.name}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gold transition-colors duration-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-16 h-16 border-4 border-primary-red border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-dark-grey">Cargando estadísticas...</p>
            </div>
          ) : error ? (
            <div className="bg-primary-red/10 border-2 border-primary-red text-primary-red p-6 rounded-lg text-center">
              <p className="text-xl font-bold mb-2">⚠️ Error</p>
              <p>{error}</p>
            </div>
          ) : stats ? (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-primary-red to-primary-red-dark text-white p-6 rounded-xl shadow-lg">
                  <div className="text-4xl mb-2">👥</div>
                  <div className="text-3xl font-bold">{stats.total_visits}</div>
                  <div className="text-sm opacity-90">Visitas Totales</div>
                </div>

                <div className="bg-gradient-to-br from-action-green to-action-green-dark text-white p-6 rounded-xl shadow-lg">
                  <div className="text-4xl mb-2">✓</div>
                  <div className="text-3xl font-bold">{stats.total_users}</div>
                  <div className="text-sm opacity-90">Usuarios Registrados</div>
                </div>

                <div className="bg-gradient-to-br from-gold to-gold-dark text-white p-6 rounded-xl shadow-lg">
                  <div className="text-4xl mb-2">🔐</div>
                  <div className="text-3xl font-bold">{stats.registered_visits}</div>
                  <div className="text-sm opacity-90">Visitas Registradas</div>
                </div>

                <div className="bg-gradient-to-br from-dark-grey to-dark-grey-light text-white p-6 rounded-xl shadow-lg">
                  <div className="text-4xl mb-2">👤</div>
                  <div className="text-3xl font-bold">{stats.anonymous_visits}</div>
                  <div className="text-sm opacity-90">Visitas Anónimas</div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-light-grey rounded-xl p-6">
                <h3 className="text-2xl font-bold text-dark-grey mb-4">Usuarios Registrados</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-medium-grey">
                        <th className="text-left p-3 font-bold text-dark-grey">Nombre</th>
                        <th className="text-left p-3 font-bold text-dark-grey">Email</th>
                        <th className="text-left p-3 font-bold text-dark-grey">Fecha de Registro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.users.map((user, index) => (
                        <tr key={index} className="border-b border-light-grey-dark hover:bg-white transition-colors">
                          <td className="p-3">{user.name}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">{formatDate(user.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {stats.users.length === 0 && (
                    <p className="text-center text-medium-grey py-8">No hay usuarios registrados aún</p>
                  )}
                </div>
              </div>

              {/* Recent Visits */}
              <div className="bg-light-grey rounded-xl p-6">
                <h3 className="text-2xl font-bold text-dark-grey mb-4">Visitas Recientes (últimas 20)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-medium-grey">
                        <th className="text-left p-3 font-bold text-dark-grey">Página</th>
                        <th className="text-left p-3 font-bold text-dark-grey">Tipo</th>
                        <th className="text-left p-3 font-bold text-dark-grey">Fecha/Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recent_visits.slice(0, 20).map((visit, index) => (
                        <tr key={index} className="border-b border-light-grey-dark hover:bg-white transition-colors">
                          <td className="p-3 font-mono text-sm">{visit.page}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              visit.user_id 
                                ? 'bg-action-green text-white' 
                                : 'bg-medium-grey text-white'
                            }`}>
                              {visit.user_id ? 'Registrado' : 'Anónimo'}
                            </span>
                          </td>
                          <td className="p-3 text-sm">{formatDate(visit.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Refresh Button */}
              <div className="text-center">
                <button
                  onClick={loadStats}
                  className="bg-primary-red hover:bg-primary-red-dark text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  🔄 Actualizar Estadísticas
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
