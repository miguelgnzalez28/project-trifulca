// Configuración de la URL del Web App de Google Apps Script
const DEFAULT_APPSCRIPT_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiAr89TD3oqv_BSGg3r5hwKsk5MKmjLP1oQ3fu9d51Q8-NWmSHvfMsiQ9kCKcHAfcPfXhPYfY3mjTmITOIgVkNQ1PRoCqQycotgez_o1LL3fhzWEA6yTQIdTWSCjCq_-yZHgv_guMDNlfV4YwPV-7flXC9WFoSHGpXVAzjBbgCXbexXGNN6E7BQmE2LKGDgbqQni9x_GQuRbdEVZY1psWkvIwHfU5VgdTgHTdbCHI1Vhwb3Bg1tfOlyLbCIrKO6BfVNor78xIsB9jtPDWAbZ-SUjXkkaQ&lib=MZKCeAZEUi6gp1Sy4Ek3tSGWkVF1S_z9v'

export const APPSCRIPT_URL = typeof window !== 'undefined' && window.APPSCRIPT_URL
  ? window.APPSCRIPT_URL
  : DEFAULT_APPSCRIPT_URL


