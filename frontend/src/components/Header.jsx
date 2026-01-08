import React from 'react'

const Header = ({ cart, onCartClick, user, onLoginClick, onAdminClick, onLogout }) => {
  const cartItemCount = cart.reduce((total, item) => total + (item.customization?.quantity || 1), 0)

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 w-full max-w-full rounded-none md:rounded-[50px]"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
      }}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer -ml-4 sm:-ml-6 lg:-ml-8 hover:opacity-90 transition-opacity duration-300" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transform = 'scale(1)';
            }}
          >
            <div className="relative flex-shrink-0">
            <img 
              src="/logotipo.png" 
              alt="Ultimate Kits Logo" 
              className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) brightness(1.1) contrast(1.1)',
                transition: 'transform 0.3s ease'
              }}
            />
            </div>
            <span 
              className="ml-3 text-xl tracking-wider transition-colors duration-300 cursor-pointer" 
              style={{fontFamily: "'Bebas Neue', 'Heading Now', sans-serif", color: '#722F37'}}
              onMouseEnter={(e) => e.target.style.color = '#D20000'}
              onMouseLeave={(e) => e.target.style.color = '#722F37'}
            >
              ULTIMATE KITS
            </span>
          </div>

          {/* Navegación central */}
          <nav className="hidden md:flex items-center space-x-8 ml-12 lg:ml-20">
              <a 
              href="#topventas" 
              className="transition-colors duration-300 cursor-pointer text-base"
              style={{fontFamily: "'Bebas Neue', 'Heading Now', sans-serif", color: '#722F37'}}
              onMouseEnter={(e) => e.target.style.color = '#D20000'}
              onMouseLeave={(e) => e.target.style.color = '#722F37'}
              >
                COLECCIONES
              </a>
              <a 
                href="#topventas" 
              className="transition-colors duration-300 cursor-pointer text-base"
              style={{fontFamily: "'Bebas Neue', 'Heading Now', sans-serif", color: '#722F37'}}
              onMouseEnter={(e) => e.target.style.color = '#D20000'}
              onMouseLeave={(e) => e.target.style.color = '#722F37'}
              >
                TOP VENTAS
              </a>
              <a 
                href="#faq" 
              className="transition-colors duration-300 cursor-pointer text-base"
              style={{fontFamily: "'Bebas Neue', 'Heading Now', sans-serif", color: '#722F37'}}
              onMouseEnter={(e) => e.target.style.color = '#D20000'}
              onMouseLeave={(e) => e.target.style.color = '#722F37'}
              >
                PREGUNTAS FRECUENTES
              </a>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* User/Login button */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span 
                  className="text-base hidden lg:block transition-colors duration-300 cursor-pointer" 
                  style={{fontFamily: "'Bebas Neue', 'Heading Now', sans-serif", color: '#722F37'}}
                  onMouseEnter={(e) => e.target.style.color = '#D20000'}
                  onMouseLeave={(e) => e.target.style.color = '#722F37'}
                >
                  Hola, {user.name || user.email || 'Usuario'}
                </span>
                
                {/* Admin button if user is admin */}
                {user.is_admin && (
                  <button
                    onClick={onAdminClick}
                    className="bg-[#FFC71F] hover:bg-[#FFD700] text-black px-4 py-2 rounded transition-all duration-300 text-base"
                    style={{fontFamily: "'Bebas Neue', 'Heading Now', sans-serif"}}
                    title="Panel de Administrador"
                  >
                    <span className="hidden lg:inline">ADMIN</span>
                    <span className="lg:hidden">⚙️</span>
                  </button>
                )}
                
                {/* Logout button */}
                <button
                  onClick={onLogout}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-all duration-300 text-base"
                  style={{fontFamily: "'Bebas Neue', 'Heading Now', sans-serif"}}
                  title="Cerrar Sesión"
                >
                  <span className="hidden lg:inline">SALIR</span>
                  <span className="lg:hidden">🚪</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-base hidden"
                style={{fontFamily: "'Bebas Neue', 'Heading Now', sans-serif"}}
                aria-hidden="true"
              >
                INICIAR SESIÓN
              </button>
            )}

            {/* Carrito */}
            <button 
              onClick={onCartClick}
              className="transition-colors duration-300 flex items-center text-base relative"
              style={{fontFamily: "'Bebas Neue', 'Heading Now', sans-serif", color: '#722F37'}}
              onMouseEnter={(e) => {
                e.target.style.color = '#D20000';
                const svg = e.target.querySelector('svg');
                if (svg) svg.style.color = '#D20000';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#722F37';
                const svg = e.target.querySelector('svg');
                if (svg) svg.style.color = '#722F37';
              }}
            >
              CARRITO
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color: '#722F37'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FFC71F] rounded-full flex items-center justify-center text-xs font-bold text-black">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
