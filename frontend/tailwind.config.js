/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Oswald', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'subtitle': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      colors: {
        // Paleta basada en PDF ULTIMATE KITS
        // Rojos principales
        'primary-red': '#D20000',
        'primary-red-dark': '#C40202',
        'primary-red-light': '#E61F1F',
        
        // Negros y grises
        'dark-grey': '#212529',
        'dark-grey-light': '#343A40',
        'dark-grey-lighter': '#495057',
        'light-grey': '#F8F9FA',
        'light-grey-dark': '#E9ECEF',
        'medium-grey': '#6C757D',
        
        // Dorado/Oro (para badges y premium)
        'gold': '#FFD700',
        'gold-dark': '#C9A00C',
        'gold-light': '#FFE55C',
        
        // Verde para botones de acción
        'action-green': '#28A745',
        'action-green-dark': '#218838',
        'action-green-light': '#34CE57',
        
        // Colores adicionales
        'white': '#FFFFFF',
        'black': '#000000',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 10s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
