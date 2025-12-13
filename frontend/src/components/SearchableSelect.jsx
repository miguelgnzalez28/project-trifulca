import React, { useState, useRef, useEffect } from 'react'

const SearchableSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = 'Seleccionar...',
  emptyMessage = 'No hay opciones disponibles'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  // Filtrar opciones basado en el término de búsqueda
  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchTerm('')
    }
  }

  const displayValue = value || placeholder

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-dark-grey mb-2">
        {label}
      </label>
      
      {/* Botón que muestra el valor seleccionado */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-3 border-2 border-white/30 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent bg-white/95 backdrop-blur-sm text-dark-grey text-left flex items-center justify-between hover:border-primary-red transition-colors duration-200 shadow-md"
      >
        <span className={value ? 'text-dark-grey' : 'text-medium-grey'}>
          {displayValue}
        </span>
        <svg
          className={`w-5 h-5 text-medium-grey transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown con búsqueda */}
      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border-2 border-medium-grey rounded-lg shadow-xl max-h-64 overflow-hidden">
          {/* Input de búsqueda */}
          <div className="p-2 border-b border-light-grey">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="w-full p-2 border border-light-grey rounded focus:ring-2 focus:ring-primary-red focus:border-transparent"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Lista de opciones */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-medium-grey text-sm">
                {emptyMessage}
              </div>
            ) : (
              <>
                {/* Opción para limpiar selección */}
                <button
                  type="button"
                  onClick={() => handleSelect('')}
                  className={`w-full text-left px-4 py-2 hover:bg-light-grey transition-colors duration-150 ${
                    !value ? 'bg-primary-red/10 text-primary-red font-semibold' : 'text-dark-grey'
                  }`}
                >
                  {placeholder}
                </button>
                
                {/* Opciones filtradas */}
                {filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-2 hover:bg-light-grey transition-colors duration-150 ${
                      value === option ? 'bg-primary-red/10 text-primary-red font-semibold' : 'text-dark-grey'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchableSelect

