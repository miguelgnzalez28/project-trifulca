import React from 'react'
import SearchableSelect from './SearchableSelect'

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  availableOptions 
}) => {
  const { equipo, liga, version, edicion } = filters

  return (
    <div className="mb-8 bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 relative z-10">
      <h3 className="text-xl font-bold text-dark-grey mb-4">
        Filtrar por:
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por Equipo */}
        <SearchableSelect
          label="Equipo"
          value={equipo}
          onChange={(value) => onFilterChange('equipo', value)}
          options={availableOptions.equipos.filter(Boolean).sort()}
          placeholder="Todos los equipos"
          emptyMessage="No hay equipos disponibles"
        />

        {/* Filtro por Liga */}
        <SearchableSelect
          label="Liga"
          value={liga}
          onChange={(value) => onFilterChange('liga', value)}
          options={availableOptions.ligas.filter(Boolean).sort()}
          placeholder="Todas las ligas"
          emptyMessage="No hay ligas disponibles"
        />

        {/* Filtro por Versión */}
        <SearchableSelect
          label="Versión"
          value={version}
          onChange={(value) => onFilterChange('version', value)}
          options={availableOptions.versiones.filter(Boolean).sort()}
          placeholder="Todas las versiones"
          emptyMessage="No hay versiones disponibles"
        />

        {/* Filtro por Edición */}
        <SearchableSelect
          label="Edición"
          value={edicion}
          onChange={(value) => onFilterChange('edicion', value)}
          options={availableOptions.ediciones.filter(Boolean).sort()}
          placeholder="Todas las ediciones"
          emptyMessage="No hay ediciones disponibles"
        />
      </div>

      {/* Botón para limpiar filtros */}
      {(equipo || liga || version || edicion) && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              onFilterChange('equipo', '')
              onFilterChange('liga', '')
              onFilterChange('version', '')
              onFilterChange('edicion', '')
            }}
            className="px-4 py-2 bg-medium-grey hover:bg-dark-grey text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}

export default FilterBar

