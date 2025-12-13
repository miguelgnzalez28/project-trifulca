import React, { useState } from 'react'

const ProductDetail = ({ product, onAddToCart, onClose }) => {
  const [customization, setCustomization] = useState({
    size: '',
    patches: 'SIN PARCHES',
    version: 'FAN VERSION',
    sleeve: 'MANGA CORTA',
    name: '',
    number: '',
    quantity: 1
  })

  const handleInputChange = (field, value) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNumberChange = (value) => {
    // Solo permitir números (0-9)
    const numericValue = value.replace(/[^0-9]/g, '')
    // Limitar a máximo 2 dígitos (0-99)
    const limitedValue = numericValue.slice(0, 2)
    handleInputChange('number', limitedValue)
  }

  const handleQuantityChange = (change) => {
    const newQuantity = customization.quantity + change
    if (newQuantity >= 1) {
      handleInputChange('quantity', newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (!customization.size) {
      alert('Por favor selecciona una talla')
      return
    }
    
    onAddToCart(product, customization)
  }

  const burgundyColor = '#8B0000' // Rojo oscuro/Burdeos
  const darkGreenColor = '#556247' // Verde oscuro

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header con botón cerrar */}
        <div className="relative p-4 border-b border-gray-200 flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors duration-300"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-6 p-6">
            {/* Columna izquierda: Imagen */}
            <div className="flex-shrink-0 lg:w-1/3">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-light-grey">
                <img 
                  src={product.images?.[0] || product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer-when-downgrade"
                  loading="lazy"
                  onError={(e) => {
                    if (product.images && product.images.length > 1) {
                      const currentIndex = product.images.indexOf(e.target.src)
                      const nextIndex = currentIndex + 1
                      if (nextIndex < product.images.length) {
                        e.target.src = product.images[nextIndex]
                        return
                      }
                    }
                    e.target.src = `https://via.placeholder.com/500x600/FFFFFF/D20000?text=${encodeURIComponent(product.name)}`
                  }}
                />
              </div>
            </div>

            {/* Columna derecha: Título, Precio y Opciones */}
            <div className="flex-1 lg:w-2/3">
              {/* Título y Precio */}
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Bebas Neue', 'Heading Now', sans-serif" }}>
                  {product.name || 'CAMISETA S.F.C'}
                </h2>
                <div className="text-3xl md:text-4xl font-bold mb-6" style={{ color: burgundyColor, fontFamily: "'Bebas Neue', 'Heading Now', sans-serif" }}>
                  ${product.price?.toFixed(2) || '25,00'}
                </div>
              </div>

              {/* Opciones de personalización */}
              <div className="space-y-4">
              {/* TALLAS */}
              <div className="space-y-2">
                <div 
                  className="inline-block px-3 py-1 rounded-full text-white font-bold text-xs uppercase"
                  style={{ backgroundColor: burgundyColor }}
                >
                  TALLAS
                </div>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      onClick={() => handleInputChange('size', size)}
                      className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 text-sm ${
                        customization.size === size
                          ? 'text-white shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      style={customization.size === size ? { backgroundColor: burgundyColor } : {}}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <a 
                  href="#" 
                  className="text-xs underline inline-block"
                  style={{ color: burgundyColor }}
                >
                  GUÍA DE TALLAS
                </a>
              </div>

              {/* PARCHES */}
              <div className="space-y-2">
                <div 
                  className="inline-block px-3 py-1 rounded-full text-white font-bold text-xs uppercase"
                  style={{ backgroundColor: burgundyColor }}
                >
                  PARCHES
                </div>
                <div className="flex flex-wrap gap-2">
                  {['SIN PARCHES', 'OPCIÓN 2', 'OPCIÓN 3'].map(patch => (
                    <button
                      key={patch}
                      onClick={() => handleInputChange('patches', patch)}
                      className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 text-sm ${
                        customization.patches === patch
                          ? 'text-white shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      style={customization.patches === patch ? { backgroundColor: burgundyColor } : {}}
                    >
                      {patch}
                    </button>
                  ))}
                </div>
              </div>

              {/* VERSIÓN */}
              <div className="space-y-2">
                <div 
                  className="inline-block px-3 py-1 rounded-full text-white font-bold text-xs uppercase"
                  style={{ backgroundColor: burgundyColor }}
                >
                  VERSIÓN
                </div>
                <div className="flex flex-wrap gap-2">
                  {['FAN VERSION', 'PLAYER VERSION'].map(version => (
                    <button
                      key={version}
                      onClick={() => handleInputChange('version', version)}
                      className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 text-sm ${
                        customization.version === version
                          ? 'text-white shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      style={customization.version === version ? { backgroundColor: burgundyColor } : {}}
                    >
                      {version}
                    </button>
                  ))}
                </div>
              </div>

              {/* MANGAS */}
              <div className="space-y-2">
                <div 
                  className="inline-block px-3 py-1 rounded-full text-white font-bold text-xs uppercase"
                  style={{ backgroundColor: burgundyColor }}
                >
                  MANGAS
                </div>
                <div className="flex flex-wrap gap-2">
                  {['MANGA CORTA', 'MANGA LARGA'].map(sleeve => (
                    <button
                      key={sleeve}
                      onClick={() => handleInputChange('sleeve', sleeve)}
                      className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 text-sm ${
                        customization.sleeve === sleeve
                          ? 'text-white shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      style={customization.sleeve === sleeve ? { backgroundColor: burgundyColor } : {}}
                    >
                      {sleeve}
                    </button>
                  ))}
                </div>
              </div>

              {/* NOMBRE Y DORSAL */}
              <div className="space-y-2">
                <div 
                  className="inline-block px-3 py-1 rounded-full text-white font-bold text-xs uppercase"
                  style={{ backgroundColor: burgundyColor }}
                >
                  NOMBRE Y DORSAL
                </div>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={customization.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:border-gray-400 text-sm"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              </div>

              {/* NÚMERO DORSAL */}
              <div className="space-y-2">
                <div 
                  className="inline-block px-3 py-1 rounded-full text-white font-bold text-xs uppercase"
                  style={{ backgroundColor: burgundyColor }}
                >
                  NÚMERO DORSAL
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Número (0-99)"
                  maxLength="2"
                  value={customization.number}
                  onChange={(e) => handleNumberChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
                      e.preventDefault()
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:border-gray-400 text-sm"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              </div>

              {/* CANTIDAD */}
              <div className="space-y-2">
                <div 
                  className="inline-block px-3 py-1 rounded-full text-white font-bold text-xs uppercase"
                  style={{ backgroundColor: burgundyColor }}
                >
                  CANTIDAD
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-9 h-9 rounded-full border border-gray-300 bg-white text-gray-700 flex items-center justify-center hover:border-gray-400 transition-colors duration-300 font-bold"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-gray-900 w-10 text-center">
                    {customization.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-9 h-9 rounded-full border border-gray-300 bg-white text-gray-700 flex items-center justify-center hover:border-gray-400 transition-colors duration-300 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botón agregar al carrito */}
              <div className="mt-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 rounded-lg font-bold text-white uppercase shadow-md hover:shadow-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: darkGreenColor,
                    fontFamily: "'Bebas Neue', 'Heading Now', sans-serif",
                    fontSize: '1rem',
                    letterSpacing: '1px'
                  }}
                >
                  AGREGAR AL CARRITO
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
