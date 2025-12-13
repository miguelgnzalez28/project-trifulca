import React, { useState, useEffect } from 'react'
import { loadProducts } from '../services/productsService'

const TopSalesSection = ({ onProductSelect }) => {
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageIndexes, setImageIndexes] = useState({})

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const allProducts = await loadProducts()
        // Obtener los primeros 5 productos o los que tienen isTopSeller
        const top = allProducts
          .filter(p => p.isTopSeller)
          .slice(0, 5)
          .concat(allProducts.filter(p => !p.isTopSeller).slice(0, 5 - allProducts.filter(p => p.isTopSeller).length))
          .slice(0, 5)
        setTopProducts(top)
      } catch (error) {
        console.error('Error cargando productos top:', error)
        setTopProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchTopProducts()
  }, [])

  const cardMaskStyle = {
    WebkitMaskImage: "url('/TARJETA-mask.svg')",
    maskImage: "url('/TARJETA-mask.svg')",
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    backgroundColor: '#0a0809',
    overflow: 'hidden'
  }

  const frameOverlayStyle = {
    ...cardMaskStyle,
    pointerEvents: 'none',
    backgroundImage: "url('/TARJETA.svg')",
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    mixBlendMode: 'screen',
    filter: 'invert(1) brightness(0.6)',
    opacity: 0.35
  }

  const handleImageError = (product) => {
    setImageIndexes(prev => {
      const currentIndex = prev[product.id] ?? 0
      const totalVariants = Array.isArray(product.images) ? product.images.length : 0
      const nextIndex = currentIndex + 1

      if (totalVariants > 0 && nextIndex < totalVariants) {
        return { ...prev, [product.id]: nextIndex }
      }
      return { ...prev, [product.id]: -1 }
    })
  }
  return (
    <section 
      id="topventas"
      className="top-sales-section"
      style={{
        backgroundColor: '#f1f0e8',
        position: 'relative',
        padding: '60px 20px',
        overflow: 'hidden',
        // Textura sutil de papel/tela - puedes usar una imagen de fondo si lo prefieres
        // backgroundImage: 'url("path/to/texture-image.png")',
        // backgroundRepeat: 'repeat',
        // backgroundSize: '200px 200px',
        // opacity: 0.1
      }}
    >
      {/* Formas geométricas decorativas con pseudo-elementos */}
      <div
        className="geometric-shape-1"
        style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '300px',
          height: '300px',
          backgroundColor: '#556247',
          opacity: 0.1,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          transform: 'rotate(45deg)',
          zIndex: 0
        }}
      />
      <div
        className="geometric-shape-2"
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '400px',
          height: '400px',
          backgroundColor: '#556247',
          opacity: 0.1,
          borderRadius: '50%',
          zIndex: 0
        }}
      />
      <div
        className="geometric-shape-3"
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '10%',
          width: '250px',
          height: '250px',
          backgroundColor: '#556247',
          opacity: 0.1,
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          transform: 'rotate(15deg)',
          zIndex: 0
        }}
      />

      {/* Contenedor del contenido */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Título con trofeos */}
        <div 
          className="section-title"
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px'
          }}
        >
          {/* Trofeo izquierdo (rotado/espejo) */}
          <span
            style={{
              fontSize: '3rem',
              color: '#a07a4a',
              transform: 'scaleX(-1)',
              display: 'inline-block',
              lineHeight: 1
            }}
          >
            🏆
          </span>

          {/* Título */}
          <h2
            className="text-5xl md:text-6xl font-black mb-4"
            style={{
              fontFamily: "'Bebas Neue', 'Heading Now', sans-serif",
              color: '#333',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              margin: 0
            }}
          >
            NUESTRO TOP VENTAS
          </h2>

          {/* Trofeo derecho (normal) */}
          <span
            style={{
              fontSize: '3rem',
              color: '#a07a4a',
              display: 'inline-block',
              lineHeight: 1
            }}
          >
            🏆
          </span>
        </div>

        {/* Grid de productos top */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-16 h-16 border-4 border-primary-red border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-700">Cargando productos...</p>
          </div>
        ) : topProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
            {topProducts.map((product) => {
              const candidateImages = Array.isArray(product.images) && product.images.length > 0
                ? product.images
                : (product.image ? [product.image] : [])
              const currentImageIndex = imageIndexes[product.id] ?? 0
              const imageUrl = currentImageIndex === -1
                ? null
                : candidateImages[currentImageIndex] || null

              return (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => onProductSelect && onProductSelect(product)}
                >
                  {/* Badge TOP */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-[#a07a4a] text-white px-3 py-1 rounded-full font-bold text-sm flex items-center space-x-1 shadow-lg">
                      <span>🏆</span>
                      <span>TOP</span>
                    </div>
                  </div>

                  {/* Imagen del producto */}
                  <div className="relative aspect-[355/568]">
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          style={cardMaskStyle}
                          referrerPolicy="no-referrer-when-downgrade"
                          loading="lazy"
                          onError={() => handleImageError(product)}
                        />
                        <div
                          className="absolute inset-0"
                          style={frameOverlayStyle}
                        />
                      </>
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-light-grey text-medium-grey text-sm font-semibold uppercase tracking-wide"
                        style={cardMaskStyle}
                      >
                        Imagen no disponible
                      </div>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="p-5">
                    {/* Nombre del producto */}
                    <h3 
                      className="font-bold text-lg mb-2 text-dark-grey group-hover:text-primary-red transition-colors duration-300 line-clamp-2"
                      style={{ fontFamily: "'Bebas Neue', 'Heading Now', sans-serif" }}
                    >
                      {product.name}
                    </h3>
                    
                    {/* Badges de marca y sponsor */}
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs bg-light-grey text-medium-grey px-2 py-1 rounded font-semibold">
                        {product.brand}
                      </span>
                      <span className="text-xs bg-light-grey text-medium-grey px-2 py-1 rounded font-semibold">
                        {product.sponsor}
                      </span>
                    </div>

                    {/* Precio */}
                    <div className="mb-4">
                      <span className="text-sm text-medium-grey">DESDE</span>
                      <div className="text-2xl font-bold text-primary-red">
                        ${product.price}
                      </div>
                    </div>

                    {/* Botón de acción */}
                    <button 
                      className="w-full bg-action-green hover:bg-action-green-dark text-white py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg uppercase"
                      style={{ fontFamily: "'Bebas Neue', 'Heading Now', sans-serif" }}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-700">No hay productos disponibles</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default TopSalesSection
