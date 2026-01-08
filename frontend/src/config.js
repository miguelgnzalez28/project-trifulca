// Configuración de la URL del Web App de Google Apps Script
const DEFAULT_APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdpCEgaboTEc8q-yqSSrph2RaJxskNSL_4K_9GbzDjNkUbkjzzimnERu_JCIBJyqAd/exec'

export const APPSCRIPT_URL = typeof window !== 'undefined' && window.APPSCRIPT_URL
  ? window.APPSCRIPT_URL
  : DEFAULT_APPSCRIPT_URL


