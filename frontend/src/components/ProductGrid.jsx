import React, { useState, useEffect, useMemo } from 'react'
import { loadProducts } from '../services/productsService'
import SearchBar from './SearchBar'
import FilterBar from './FilterBar'

const ProductGrid = ({ onProductSelect }) => {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageIndexes, setImageIndexes] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    equipo: '',
    liga: '',
    version: '',
    edicion: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 20

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Cargando productos desde Google Drive...')
        const loadedProducts = await loadProducts()
        console.log(`✅ ${loadedProducts.length} productos cargados desde Google Drive`)
        setAllProducts(loadedProducts)
        setImageIndexes({})
      } catch (error) {
        console.error('❌ Error cargando productos desde Drive:', error)
        setAllProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Calcular opciones disponibles dinámicamente basadas en otros filtros activos
  const availableOptions = useMemo(() => {
    // Primero, filtrar productos por otros filtros (excluyendo el filtro actual)
    const tempFiltered = allProducts.filter(product => {
      const matchesEquipo = !filters.equipo || product.equipo === filters.equipo
      const matchesLiga = !filters.liga || product.liga === filters.liga
      const matchesVersion = !filters.version || product.version === filters.version
      const matchesEdicion = !filters.edicion || product.edicion === filters.edicion
      return matchesEquipo && matchesLiga && matchesVersion && matchesEdicion
    })

    // Extraer opciones únicas de los productos filtrados
    const equipos = new Set()
    const ligas = new Set()
    const versiones = new Set()
    const ediciones = new Set()

    tempFiltered.forEach(product => {
      if (product.equipo) equipos.add(product.equipo)
      if (product.liga) ligas.add(product.liga)
      if (product.version) versiones.add(product.version)
      if (product.edicion) ediciones.add(product.edicion)
    })

    // Asegurar que el valor seleccionado actual siempre esté disponible
    if (filters.equipo) equipos.add(filters.equipo)
    if (filters.liga) ligas.add(filters.liga)
    if (filters.version) versiones.add(filters.version)
    if (filters.edicion) ediciones.add(filters.edicion)

    return {
      equipos: Array.from(equipos),
      ligas: Array.from(ligas),
      versiones: Array.from(versiones),
      ediciones: Array.from(ediciones)
    }
  }, [allProducts, filters])

  // Filtrar productos basado en la búsqueda y filtros
  const filteredProducts = useMemo(() => {
    let filtered = allProducts

    // Aplicar filtros de etiquetas
    if (filters.equipo) {
      filtered = filtered.filter(product => product.equipo === filters.equipo)
    }
    if (filters.liga) {
      filtered = filtered.filter(product => product.liga === filters.liga)
    }
    if (filters.version) {
      filtered = filtered.filter(product => product.version === filters.version)
    }
    if (filters.edicion) {
      filtered = filtered.filter(product => product.edicion === filters.edicion)
    }

    // Aplicar búsqueda de texto
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(product => {
        const searchableText = [
          product.name,
          product.brand,
          product.description,
          product.sponsor,
          product.raw?.title,
          product.raw?.liga,
          product.raw?.content
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchableText.includes(searchLower)
      })
    }

    return filtered
  }, [allProducts, searchTerm, filters])

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Resetear página cuando cambia la búsqueda o los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImageError = (product) => {
    console.warn(`⚠️ Error cargando imagen para ${product.name} (ID ${product.id}). Intentando siguiente variante...`)
    setImageIndexes(prev => {
      const currentIndex = prev[product.id] ?? 0
      const totalVariants = Array.isArray(product.images) ? product.images.length : 0
      const nextIndex = currentIndex + 1

      if (totalVariants > 0 && nextIndex < totalVariants) {
        console.info(`➡️ Usando variante #${nextIndex + 1} para ${product.name}`)
        return { ...prev, [product.id]: nextIndex }
      }

      console.error(`❌ Sin variantes adicionales para ${product.name}. Marcando como no disponible.`)
      return { ...prev, [product.id]: -1 }
    })
  }

  if (loading) {
    return (
      <section id="topventas" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-primary-red border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-2xl font-semibold text-dark-grey">Cargando productos...</h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="catalogo" className="py-20 relative overflow-hidden">
      {/* Imagen de fondo con overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80')",
          opacity: 0.15
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-0">
        {/* Título de sección */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-black mb-4" style={{ color: '#8B0000' }}>
            CATÁLOGO DE PRODUCTOS
          </h2>
          <div className="w-24 h-1 bg-primary-red mx-auto mb-6 shadow-lg"></div>
        </div>

        {/* Barra de búsqueda */}
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Buscar por nombre, marca, liga, descripción..."
        />

        {/* Barra de filtros */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          availableOptions={availableOptions}
        />

        {/* Contador de resultados */}
        {(searchTerm || filters.equipo || filters.liga || filters.version || filters.edicion) && (
          <div className="mb-6 text-center">
            <p className="text-lg text-white/90 drop-shadow-md" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
              {filteredProducts.length === 0 ? (
                <span>
                  No se encontraron productos
                  {searchTerm && ` para "<span className="font-bold text-white">${searchTerm}</span>"`}
                  {(filters.equipo || filters.liga || filters.version || filters.edicion) && ' con los filtros seleccionados'}
                </span>
              ) : (
                <span>
                  Mostrando <span className="font-bold text-white">{filteredProducts.length}</span> de{' '}
                  <span className="font-bold text-white">{allProducts.length}</span> productos
                </span>
              )}
            </p>
          </div>
        )}

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-0">
          {paginatedProducts.map((product, index) => {
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
                className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer card-hover"
                onClick={() => onProductSelect && onProductSelect(product)}
              >
                {/* Badge TOP 10 para productos destacados */}
                {product.isTopSeller && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gold text-dark-grey px-3 py-1 rounded-full font-bold text-sm flex items-center space-x-1 shadow-lg">
                      <span>🏆</span>
                      <span>TOP 10</span>
                    </div>
                  </div>
                )}

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
                        onLoad={() => console.log(`✅ Imagen cargada: ${product.name} usando variante ${currentImageIndex + 1} - ${imageUrl}`)}
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
                  <h3 className="font-bold text-lg mb-2 text-dark-grey group-hover:text-primary-red transition-colors duration-300 line-clamp-2">
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
                  <button className="w-full bg-action-green hover:bg-action-green-dark text-white py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg uppercase">
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Paginación */}
        {filteredProducts.length > productsPerPage && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-light-grey text-dark-grey rounded-lg font-semibold hover:bg-medium-grey disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Anterior
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Mostrar primera página, última página, página actual y páginas adyacentes
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                })
                .map((page, index, array) => {
                  // Agregar puntos suspensivos si hay un salto
                  const showEllipsis = index > 0 && array[index] - array[index - 1] > 1
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && (
                        <span className="px-2 text-medium-grey">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                          currentPage === page
                            ? 'bg-primary-red text-white'
                            : 'bg-light-grey text-dark-grey hover:bg-medium-grey'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  )
                })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-light-grey text-dark-grey rounded-lg font-semibold hover:bg-medium-grey disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Información de paginación */}
        {filteredProducts.length > 0 && (
          <div className="mt-6 text-center text-medium-grey">
            <p>
              Página {currentPage} de {totalPages} • 
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} productos
            </p>
          </div>
        )}

        {/* Mensaje si no hay productos */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-20">
            {(searchTerm || filters.equipo || filters.liga || filters.version || filters.edicion) ? (
              <div>
                <p className="text-xl text-white/90 mb-4 drop-shadow-md" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                  No se encontraron productos
                  {searchTerm && ` para "<span className="font-bold text-white">${searchTerm}</span>"`}
                  {(filters.equipo || filters.liga || filters.version || filters.edicion) && ' con los filtros seleccionados'}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilters({ equipo: '', liga: '', version: '', edicion: '' })
                  }}
                  className="text-white bg-primary-red hover:bg-primary-red-dark px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300"
                >
                  Limpiar búsqueda y filtros
                </button>
              </div>
            ) : (
              <p className="text-xl text-white/90 drop-shadow-md" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                No hay productos disponibles en este momento.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductGrid
