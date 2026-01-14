import React, { useState, useEffect, useMemo } from 'react'
import { loadProducts } from '../services/productsService'

const CollectionsSection = ({ onProductSelect }) => {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageIndexes, setImageIndexes] = useState({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const loadedProducts = await loadProducts()
        setAllProducts(loadedProducts)
        setImageIndexes({})
      } catch (error) {
        console.error('Error cargando productos para colecciones:', error)
        setAllProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Agrupar productos por el nombre completo del equipo
  const collections = useMemo(() => {
    const grouped = {}
    
    allProducts.forEach(product => {
      // Usar el nombre del equipo, si no existe usar liga
      const equipoName = (product.equipo || product.liga || '').trim().toUpperCase()
      
      if (equipoName) {
        if (!grouped[equipoName]) {
          grouped[equipoName] = []
        }
        grouped[equipoName].push(product)
      }
    })

    // Obtener las 3 colecciones con más productos
    const sortedCollections = Object.entries(grouped)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3)
      .map(([equipoName, products]) => ({
        equipoName,
        products: products.slice(0, 4) // Máximo 4 productos por colección (2 filas)
      }))

    return sortedCollections
  }, [allProducts])

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

  if (loading) {
    return (
      <section 
        className="collections-section"
        style={{
          backgroundColor: '#f1f0e8',
          position: 'relative',
          padding: '60px 20px',
          overflow: 'hidden'
        }}
      >
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center py-12">
            <div className="inline-block w-16 h-16 border-4 border-primary-red border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-700">Cargando colecciones...</p>
          </div>
        </div>
      </section>
    )
  }

  if (collections.length === 0) {
    return null
  }

  return (
    <section 
      id="colecciones"
      className="collections-section"
      style={{
        backgroundColor: '#f1f0e8',
        position: 'relative',
        padding: '60px 20px',
        overflow: 'hidden'
      }}
    >
      {/* Formas geométricas decorativas */}
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
          bottom: '-80px',
          right: '-80px',
          width: '400px',
          height: '400px',
          backgroundColor: '#556247',
          opacity: 0.1,
          borderRadius: '50%',
          zIndex: 0
        }}
      />

      {/* Contenedor del contenido */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Título */}
        <div 
          className="section-title"
          style={{
            textAlign: 'center',
            marginBottom: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px'
          }}
        >
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
            COLECCIONES
          </h2>
        </div>

        {/* Grid de 3 colecciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {collections.map((collection, collectionIndex) => (
            <div key={collection.equipoName} className="collection-column">
              {/* Título de la colección */}
              <div className="mb-6 text-center">
                <h3
                  className="text-4xl md:text-5xl font-black"
                  style={{
                    fontFamily: "'Bebas Neue', 'Heading Now', sans-serif",
                    color: '#722F37',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    marginBottom: '10px'
                  }}
                >
                  {collection.equipoName}
                </h3>
              </div>

              {/* Grid de productos de la colección */}
              <div className="grid grid-cols-2 gap-4">
                {collection.products.map((product) => {
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
                            className="absolute inset-0 flex items-center justify-center bg-light-grey text-medium-grey text-xs font-semibold uppercase tracking-wide p-2"
                            style={cardMaskStyle}
                          >
                            Sin imagen
                          </div>
                        )}
                      </div>

                      {/* Información del producto */}
                      <div className="p-3">
                        {/* Nombre del producto */}
                        <h4 
                          className="font-bold text-sm mb-1 text-dark-grey group-hover:text-primary-red transition-colors duration-300 line-clamp-2"
                          style={{ fontFamily: "'Bebas Neue', 'Heading Now', sans-serif" }}
                        >
                          {product.name}
                        </h4>
                        
                        {/* Precio */}
                        <div className="mt-2">
                          <span className="text-xs text-medium-grey">DESDE</span>
                          <div className="text-lg font-bold text-primary-red">
                            ${product.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CollectionsSection
