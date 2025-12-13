import React, { useState } from 'react'
import { sendRegistrationToAppScript } from '../services/registrationService'

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Error en la autenticación')
      }

      // Si es registro, enviar datos a AppScript
      if (!isLogin) {
        try {
          const appScriptResult = await sendRegistrationToAppScript({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
          
          if (!appScriptResult.success) {
            console.warn('⚠️ No se pudo enviar datos a AppScript, pero el registro fue exitoso:', appScriptResult.error)
            // No bloqueamos el registro si falla el envío a AppScript
          }
        } catch (appScriptError) {
          console.error('❌ Error enviando a AppScript:', appScriptError)
          // No bloqueamos el registro si falla el envío a AppScript
        }
      }

      // Guardar token y usuario (el backend retorna access_token)
      const token = data.access_token || data.token
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Mostrar mensaje de éxito
      if (!isLogin) {
        alert('¡Registro exitoso! Has iniciado sesión automáticamente.')
      } else {
        alert('¡Bienvenido de nuevo!')
      }
      
      onSuccess(data.user)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-dark-grey p-6 text-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </h2>
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

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-dark-grey mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full p-3 border-2 border-light-grey-dark rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-dark-grey mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border-2 border-light-grey-dark rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-grey mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 border-2 border-light-grey-dark rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-primary-red/10 border-2 border-primary-red text-primary-red p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-red hover:bg-primary-red-dark text-white py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setFormData({ email: '', password: '', name: '' })
              }}
              className="text-primary-red hover:text-primary-red-dark font-semibold transition-colors duration-300"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
