import React, { useState, useEffect } from 'react'

const HeroBanner = () => {
  const [currentImage, setCurrentImage] = useState(0)

  const footballerImages = [
    'https://images.unsplash.com/photo-1759674794418-26371e3851a9',
    'https://images.unsplash.com/photo-1677119966332-8c6e9fb0efab',
    'https://images.unsplash.com/photo-1657957746418-6a38df9e1ea7',
    'https://images.pexels.com/photos/34317187/pexels-photo-34317187.jpeg',
    'https://images.pexels.com/photos/34317185/pexels-photo-34317185.jpeg',
    'https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % footballerImages.length)
    }, 5000) // Cambiar imagen cada 5 segundos

    return () => clearInterval(interval)
  }, [footballerImages.length])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Images Slider with Parallax Effect */}
      <div className="absolute inset-0">
        {footballerImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
              index === currentImage
                ? 'opacity-30 scale-100'
                : 'opacity-0 scale-110'
            }`}
            style={{
              backgroundImage: `url(${image}?w=1920&h=1080&fit=crop&auto=format&q=80)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.4) saturate(1.2)'
            }}
          />
        ))}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-primary-red/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
      </div>

      {/* Animated Floating Football Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-white/5 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-primary-red/10 rounded-full blur-2xl animate-float-slower"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-gold/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-60 right-40 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Logo principal */}
        <div className="mb-10 animate-fade-in flex justify-center">
          <div className="relative inline-flex items-center justify-center">
            {/* Glow effect circular detrás del logo */}
            <div className="absolute w-56 h-56 bg-gradient-radial from-white/20 to-transparent blur-2xl rounded-full"></div>
            {/* Contenedor con glassmorphism - forma circular más pequeña */}
            <div className="relative bg-white/95 backdrop-blur-md rounded-full p-4 shadow-2xl flex items-center justify-center">
              <img 
                src="/logotipo.png" 
                alt="Ultimate Kits Logo" 
                className="h-52 w-52 object-contain animate-pulse-slow"
              />
            </div>
          </div>
        </div>

        {/* Título principal con efecto glitch */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-white animate-slide-up drop-shadow-2xl">
          ULTIMATE KITS
        </h1>

        {/* Subtítulo */}
        <p className="text-2xl md:text-3xl mb-4 text-primary-red font-bold animate-slide-up drop-shadow-lg" style={{animationDelay: '0.2s'}}>
          Las Mejores Camisetas Deportivas
        </p>

        {/* Descripción */}
        <p className="text-lg md:text-xl mb-12 text-white/90 max-w-2xl mx-auto animate-slide-up drop-shadow-md" style={{animationDelay: '0.4s'}}>
          Descubre nuestra colección exclusiva de camisetas de los mejores equipos del mundo
        </p>

        {/* CTA Buttons con efecto hover especial */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in" style={{animationDelay: '0.6s'}}>
          <a 
            href="#topventas" 
            className="group relative bg-primary-red hover:bg-primary-red-dark text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-primary-red/50 transform hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10">VER COLECCIÓN</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-red-dark to-primary-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
          <a 
            href="#faq" 
            className="group relative bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 border-2 border-white/50 hover:border-gold shadow-2xl"
          >
            PREGUNTAS FRECUENTES
          </a>
        </div>

        {/* Badge/Trophy indicator con animación */}
        <div className="mt-16 flex justify-center items-center space-x-8 animate-fade-in" style={{animationDelay: '0.8s'}}>
          <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-3xl mb-2 shadow-2xl shadow-gold/50 animate-bounce-slow">
              🏆
            </div>
            <span className="text-sm font-semibold text-white drop-shadow-md">Calidad Premium</span>
          </div>
          <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300">
            <div className="w-16 h-16 bg-primary-red rounded-full flex items-center justify-center text-3xl mb-2 shadow-2xl shadow-primary-red/50 animate-bounce-slow" style={{animationDelay: '0.2s'}}>
              ⚽
            </div>
            <span className="text-sm font-semibold text-white drop-shadow-md">Auténticas</span>
          </div>
          <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300">
            <div className="w-16 h-16 bg-action-green rounded-full flex items-center justify-center text-3xl mb-2 shadow-2xl shadow-action-green/50 animate-bounce-slow" style={{animationDelay: '0.4s'}}>
              ✓
            </div>
            <span className="text-sm font-semibold text-white drop-shadow-md">Garantizadas</span>
          </div>
        </div>

        {/* Progress Dots para el slider */}
        <div className="mt-12 flex justify-center space-x-2">
          {footballerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImage
                  ? 'w-8 bg-primary-red'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator animado */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

export default HeroBanner
