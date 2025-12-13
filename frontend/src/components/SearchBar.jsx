import React, { useState } from 'react'

const SearchBar = ({ onSearch, placeholder = "Buscar productos..." }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-white/70" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-lg border-2 border-white/30 rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/50 transition-all duration-300 bg-white/95 backdrop-blur-sm text-dark-grey placeholder-medium-grey shadow-lg"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-medium-grey hover:text-primary-red transition-colors duration-200"
            aria-label="Limpiar búsqueda"
          >
            <svg 
              className="h-5 w-5" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="mt-2 text-sm text-white/90 drop-shadow-md">
          Buscando: <span className="font-semibold text-white">"{searchTerm}"</span>
        </div>
      )}
    </div>
  )
}

export default SearchBar




