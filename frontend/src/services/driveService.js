// Servicio para obtener imágenes desde Google Drive usando AppScript
import { APPSCRIPT_URL } from '../config'

// Función para convertir URL de Google Drive a URL directa
const convertDriveUrl = (driveUrl) => {
  if (!driveUrl) return null
  
  console.log('Convirtiendo URL:', driveUrl)
  
  // Si ya es una URL directa, devolverla
  if (driveUrl.includes('drive.google.com/thumbnail') || driveUrl.startsWith('http')) {
    console.log('URL ya es directa/thumbnail, devolviendo:', driveUrl)
    return driveUrl
  }
  
  // Extraer el ID del archivo de Google Drive
  const match = driveUrl.match(/[-\w]{25,}/)
  if (match) {
    const fileId = match[0]
    console.log('ID del archivo encontrado:', fileId)
    
    const urls = [
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000&export=download`,
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://drive.google.com/file/d/${fileId}/preview`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`
    ]
    console.log('URLs generadas:', urls)
    return urls[0]
  }
  
  console.log('No se pudo extraer ID, devolviendo URL original:', driveUrl)
  return driveUrl
}

// Función para obtener productos desde Google Drive
export const getProductsFromDrive = async () => {
  try {
    console.log('=== INICIANDO CARGA DE PRODUCTOS ===')
    console.log('URL del Apps Script:', APPSCRIPT_URL)
    
    if (!APPSCRIPT_URL) {
      console.warn('APPSCRIPT_URL vacío. Usando productos estáticos de fallback.')
      return getStaticProducts()
    }

    const ts = Date.now()
    const urlWithBypass = `${APPSCRIPT_URL}${APPSCRIPT_URL.includes('?') ? '&' : '?'}_ts=${ts}`

    console.log('Haciendo petición al Apps Script...', urlWithBypass)
    const response = await fetch(urlWithBypass, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store',
      mode: 'cors'
    })
    
    console.log('Respuesta del servidor:', response.status, response.statusText)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const articles = await response.json()
    console.log('Artículos recibidos del Apps Script:', articles)
    
    const products = articles.map((article, index) => {
      console.log(`\n--- Procesando artículo ${index + 1}: ${article.title} ---`)
      console.log('Imágenes originales:', article.images)
      
      const mainImage = article.images && article.images.length > 0 
        ? convertDriveUrl(article.images[0])
        : null
      
      console.log('Imagen principal convertida:', mainImage)
      
      const product = {
        id: index + 1,
        name: (article.title || `Producto ${index + 1}`).toUpperCase(),
        price: 25.00,
        image: mainImage || `https://via.placeholder.com/300x400?text=${encodeURIComponent(article.title || 'Producto')}`,
        images: article.images?.map(img => convertDriveUrl(img)) || [],
        description: article.content || `Camiseta oficial ${article.title || ''}`,
        sponsor: getRandomSponsor(),
        brand: getRandomBrand()
      }
      console.log('Producto final:', product)
      return product
    })
    
    console.log('=== PRODUCTOS FINALES ===', products)
    return products
  } catch (error) {
    console.error('=== ERROR EN CARGA DE PRODUCTOS ===')
    console.error('Error completo:', error)
    console.error('Mensaje de error:', error.message)
    console.error('Stack trace:', error.stack)
    return getStaticProducts()
  }
}

// Función para obtener patrocinadores aleatorios
const getRandomSponsor = () => {
  const sponsors = ['Emirates FLY BETTER', 'Spotify', 'MK体育', 'TeamViewer', 'Standard Chartered']
  return sponsors[Math.floor(Math.random() * sponsors.length)]
}

// Función para obtener marcas aleatorias
const getRandomBrand = () => {
  const brands = ['Adidas', 'Nike', 'Puma', 'Umbro']
  return brands[Math.floor(Math.random() * brands.length)]
}

// Productos estáticos como fallback
const getStaticProducts = () => [
  {
    id: 1,
    name: "MADRID HOME JERSEY",
    price: 25.00,
    image: "https://via.placeholder.com/300x400?text=Real+Madrid+Home",
    description: "Camiseta oficial del Real Madrid con patrocinador Emirates FLY BETTER",
    sponsor: "Emirates FLY BETTER",
    brand: "Adidas"
  },
  {
    id: 2,
    name: "CAMISETA S.F.C.",
    price: 25.00,
    image: "https://via.placeholder.com/300x400?text=Santos+FC+Home",
    description: "Camiseta oficial del Santos FC con patrocinador Spotify",
    sponsor: "Spotify",
    brand: "Adidas"
  },
  {
    id: 3,
    name: "BARCELONA HOME JERSEY",
    price: 25.00,
    image: "https://via.placeholder.com/300x400?text=Barcelona+Home",
    description: "Camiseta oficial del FC Barcelona con patrocinador Spotify",
    sponsor: "Spotify",
    brand: "Nike"
  },
  {
    id: 4,
    name: "MANCHESTER UNITED HOME",
    price: 25.00,
    image: "https://via.placeholder.com/300x400?text=Man+United+Home",
    description: "Camiseta oficial del Manchester United con patrocinador TeamViewer",
    sponsor: "TeamViewer",
    brand: "Adidas"
  },
  {
    id: 5,
    name: "LIVERPOOL HOME JERSEY",
    price: 25.00,
    image: "https://via.placeholder.com/300x400?text=Liverpool+Home",
    description: "Camiseta oficial del Liverpool FC con patrocinador Standard Chartered",
    sponsor: "Standard Chartered",
    brand: "Nike"
  },
  {
    id: 6,
    name: "CHINESE SUPER LEAGUE",
    price: 25.00,
    image: "https://via.placeholder.com/300x400?text=Chinese+League",
    description: "Camiseta de la Superliga China con patrocinador MK体育",
    sponsor: "MK体育",
    brand: "Adidas"
  }
]
