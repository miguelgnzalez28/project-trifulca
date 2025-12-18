// Servicio para cargar productos desde Google Drive
export let mockProducts = [];

const DEMO_APP_SCRIPT_URL =
  (typeof window !== 'undefined' && window.APPSCRIPT_URL) ||
  'https://script.google.com/macros/s/AKfycbwJeBmEY53VYRy_axC-aVJ-rhXxHmTnWTbObJugG4G2soVW_Bo_SyUqXytu6oKtR8c/exec';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const PROXY_URL = `${BACKEND_URL}/api/products`;

async function fetchFromAppScript(retries = 3) {
  const url = `${DEMO_APP_SCRIPT_URL}${DEMO_APP_SCRIPT_URL.includes('?') ? '&' : '?'}_ts=${Date.now()}`;
  
  // Timeout para la petición
  const timeout = 30000; // 30 segundos
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[productsService] Intento ${attempt}/${retries} de cargar desde AppScript...`);
      
      // Usar headers simples para evitar preflight CORS
      // IMPORTANTE: No usar Cache-Control u otros headers que causen preflight
      const fetchOptions = {
        method: 'GET',
        cache: 'no-store',
        credentials: 'omit',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      };

      // Crear un AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      fetchOptions.signal = controller.signal;

      const response = await fetch(url, fetchOptions);
      
      clearTimeout(timeoutId);

      // Si la respuesta no es OK, intentar leer el texto para debugging
      if (!response.ok) {
        const text = await response.text().catch(() => 'No se pudo leer el error');
        console.warn(`[productsService] Error HTTP ${response.status}:`, text);
        
        if (attempt < retries) {
          // Esperar antes de reintentar (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        
        throw new Error(`App Script error (${response.status} ${response.statusText}): ${text}`);
      }

      // Intentar parsear JSON
      try {
        const data = await response.json();
        console.log(`[productsService] ✅ Datos recibidos del AppScript (intento ${attempt})`);
        return data;
      } catch (jsonError) {
        console.error('[productsService] Error parseando JSON:', jsonError);
        const text = await response.text();
        console.error('[productsService] Respuesta recibida (texto):', text.substring(0, 200));
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        
        throw new Error(`Error parseando respuesta JSON: ${jsonError.message}`);
      }
    } catch (error) {
      console.error(`[productsService] Error en intento ${attempt}:`, error);
      
      // Si es el último intento, lanzar el error
      if (attempt === retries) {
        // Si es un error de timeout
        if (error.name === 'AbortError') {
          throw new Error(`Timeout: El AppScript no respondió a tiempo. Esto puede ser un problema de conexión o el AppScript está muy lento.`);
        }
        // Si es un error de CORS o red, dar más información
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch') || error.name === 'TypeError') {
          throw new Error(`Error de conexión con AppScript (posible problema de CORS o red): ${error.message}. Asegúrate de que el AppScript esté configurado para permitir acceso desde cualquier origen.`);
        }
        throw error;
      }
      
      // Esperar antes de reintentar (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  throw new Error('No se pudo cargar desde AppScript después de todos los intentos');
}

async function fetchFromProxy() {
  const response = await fetch(`${PROXY_URL}?_ts=${Date.now()}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-store',
    credentials: 'omit',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Proxy error (${response.status} ${response.statusText}): ${text}`);
  }

  return response.json();
}

function extractDriveFileId(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('drive.google.com')) {
      const idFromQuery = parsed.searchParams.get('id');
      if (idFromQuery) {
        return idFromQuery;
      }

      const matchFromPath = parsed.pathname.match(/\/d\/([-\w]{10,})/);
      if (matchFromPath && matchFromPath[1]) {
        return matchFromPath[1];
      }
    }

    if (parsed.hostname.includes('googleusercontent.com')) {
      const match = parsed.pathname.match(/\/d\/([-\w]{10,})/);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (error) {
    console.warn('[productsService] No se pudo extraer ID de Drive:', url, error);
  }

  return null;
}

function buildImageCandidates(value) {
  if (!value || typeof value !== 'string') {
    return [];
  }

  const trimmed = value.trim();
  const candidates = new Set([trimmed]);

  try {
    const parsed = new URL(trimmed);
    const size = parsed.searchParams.get('sz') || 'w1000';
    const fileId = extractDriveFileId(trimmed);

    if (fileId) {
      // Priorizar el backend proxy si está disponible (funciona mejor para evitar CORS)
      if (BACKEND_URL) {
        candidates.add(`${BACKEND_URL}/api/products/image/${fileId}?size=${size}`);
      }
      
      // UC format funciona mejor para archivos públicos y tiene mejor compatibilidad CORS
      candidates.add(`https://drive.google.com/uc?export=view&id=${fileId}`);
      candidates.add(`https://drive.google.com/uc?export=download&id=${fileId}`);
      candidates.add(`https://drive.googleusercontent.com/uc?id=${fileId}&export=view`);
      
      // Agregar variantes de thumbnail con diferentes parámetros
      candidates.add(`https://drive.google.com/thumbnail?id=${fileId}&sz=${size}&export=download`);
      candidates.add(`https://drive.google.com/thumbnail?id=${fileId}&sz=${size}&authuser=0`);
      
      // Preview puede funcionar
      candidates.add(`https://drive.google.com/file/d/${fileId}/preview`);
      
      // Googleusercontent puede tener problemas de CORS, dejarlo al final
      candidates.add(`https://lh3.googleusercontent.com/d/${fileId}=${size}`);
      candidates.add(`https://lh3.googleusercontent.com/d/${fileId}=${size}?authuser=0`);
      
      // Thumbnail como última opción (ya debería estar la original)
      if (!trimmed.includes('drive.google.com/thumbnail')) {
      candidates.add(`https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`);
      }
    }
  } catch (error) {
    console.warn('[productsService] URL inválida para candidates:', value, error);
  }

  return Array.from(candidates);
}

function normalizeProduct(item, index) {
  // Combinar equipo + title para el nombre del producto
  const equipo = (item.equipo || '').trim();
  const title = (item.title || item.name || `Producto ${item.id || index + 1}`).trim();
  const name = equipo && title ? `${equipo} ${title}`.trim() : (title || equipo || `Producto ${item.id || index + 1}`).trim();
  const candidateSet = new Set();

  const appendCandidates = (value) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(appendCandidates);
      return;
    }
    buildImageCandidates(value).forEach(candidate => candidateSet.add(candidate));
  };

  appendCandidates(item.images);
  appendCandidates(item.original_images || item.originalImages);
  appendCandidates(item.image);
  appendCandidates(item.url);

  const orderedCandidates = Array.from(candidateSet);
  // Priorizar URLs que funcionan mejor: 
  // 1. Proxy backend (evita problemas de CORS, más confiable)
  // 2. URL original (thumbnail) que viene del AppScript
  // 3. UC format (más compatible con CORS)
  // 4. Googleusercontent (puede tener problemas de CORS)
  const prioritized = [
    ...orderedCandidates.filter(url => url.includes('/api/products/image/')), // Proxy backend primero
    ...orderedCandidates.filter(url => url.includes('drive.google.com/thumbnail')), // URLs originales de thumbnail
    ...orderedCandidates.filter(url => url.includes('drive.google.com/uc?export=view')),
    ...orderedCandidates.filter(url => url.includes('drive.google.com/uc?export=download')),
    ...orderedCandidates.filter(url => url.includes('drive.googleusercontent.com/uc')),
    ...orderedCandidates.filter(url => url.includes('drive.google.com/file/d/')),
    ...orderedCandidates.filter(url => url.includes('lh3.googleusercontent.com/d/')),
    ...orderedCandidates,
  ];

  const uniqueOrderedImages = [];
  prioritized.forEach(url => {
    if (url && !uniqueOrderedImages.includes(url)) {
      uniqueOrderedImages.push(url);
    }
  });

  const mainImage = uniqueOrderedImages[0] || null;

  if (!mainImage) {
    console.warn('[productsService] Producto sin imagen válida, se omite:', item);
    return null;
  }

  return {
    id: item.id || index + 1,
    name: name.toUpperCase(),
    price: Number(item.price) > 0 ? Number(item.price) : 25,
    image: mainImage,
    images: uniqueOrderedImages,
    description: item.description || item.content || `Camiseta oficial ${name}`,
    brand: item.brand || item.liga || 'Oficial',
    sponsor: item.sponsor || 'Premium',
    isTopSeller: index < 10,
    equipo: item.equipo || '',
    liga: item.liga || '',
    version: item.version || '',
    edicion: item.edicion || '',
    raw: item,
  };
}

export async function loadProducts() {
  try {
    let data = [];

    // Intentar primero mediante el backend proxy para evitar CORS
    try {
      console.log('[productsService] Intentando cargar productos desde el proxy backend...');
      data = await fetchFromProxy();
      console.log('[productsService] ✅ Productos cargados desde el proxy backend');
    } catch (proxyError) {
      console.warn('[productsService] Proxy no disponible, intentando App Script directo:', proxyError.message);
      data = await fetchFromAppScript();
      console.log('[productsService] ✅ Productos cargados desde App Script directo');
    }

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('[productsService] Sin datos recibidos del App Script');
      mockProducts = [];
      return [];
    }

    const normalizedProducts = data
      .map((item, index) => normalizeProduct(item, index))
      .filter(Boolean);

    // Cargar TODOS los productos, no solo 4
    mockProducts = normalizedProducts;

    if (mockProducts.length === 0) {
      console.warn('[productsService] Ningún producto contiene imágenes válidas');
    } else {
      console.log(`[productsService] ✅ ${mockProducts.length} productos cargados correctamente`);
    }

    return mockProducts;
  } catch (error) {
    console.error('[productsService] ❌ Error cargando productos:', error);
    console.error('[productsService] URL del AppScript:', DEMO_APP_SCRIPT_URL);
    console.error('[productsService] Tipo de error:', error.name);
    console.error('[productsService] Mensaje:', error.message);
    
    mockProducts = [];
    return [];
  }
}

