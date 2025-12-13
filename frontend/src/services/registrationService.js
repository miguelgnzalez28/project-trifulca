// Servicio para enviar datos de registro a Google AppScript
const APPSCRIPT_URL = "https://script.google.com/macros/s/AKfycby6QD2j4jPufk8iy3xTuo7v_IO_xUV2VwAj7xVRRhXPgrkthdtN1ndmnkqZXH1kFc1g/exec";

/**
 * Envía los datos de registro de un usuario a Google AppScript
 * @param {Object} userData - Datos del usuario a registrar
 * @param {string} userData.name - Nombre del usuario
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.password - Contraseña
 * @returns {Promise<Object>} Respuesta del AppScript
 */
export async function sendRegistrationToAppScript(userData) {
  if (!APPSCRIPT_URL) {
    console.warn('⚠️ URL de AppScript para registro no configurada. Los datos no se enviarán a AppScript.');
    return { success: false, message: 'URL de AppScript no configurada' };
  }

  try {
    console.log('📤 Enviando datos de registro a AppScript...', userData);

    // Preparar los datos en el formato que espera el AppScript (JSON)
    const registrationData = {
      name: userData.name || '',
      email: userData.email,
      password: userData.password,
      timestamp: new Date().toISOString(),
      source: 'web_app'
    };

    console.log('📤 Datos a enviar:', registrationData);

    // El AppScript espera recibir JSON en e.postData.contents usando doPost
    // IMPORTANTE: Con mode: 'no-cors' NO podemos enviar headers personalizados
    // El body JSON se enviará y el AppScript debería poder leerlo desde e.postData.contents
    try {
      await fetch(APPSCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Evita problemas de CORS - NO permite headers personalizados
        cache: 'no-cache',
        redirect: 'follow',
        // NO incluir headers con no-cors - el navegador los ignorará
        body: JSON.stringify(registrationData)
      });
      
      // Con no-cors, siempre asumimos éxito si no hay error de red
      // No podemos leer la respuesta, pero el envío debería funcionar
      console.log('✅ Datos enviados a AppScript usando POST con JSON (no-cors mode)');
      console.log('📋 Datos enviados:', registrationData);
      return { success: true, message: 'Datos enviados correctamente a AppScript' };
    } catch (error) {
      // Con no-cors, los errores de red aún se pueden capturar
      console.error('❌ Error de red al enviar datos:', error);
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error('❌ Error enviando datos a AppScript:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualiza la URL del AppScript para registro
 * @param {string} url - Nueva URL del AppScript
 */
export function setRegistrationAppScriptUrl(url) {
  if (url) {
    // Validar que sea una URL válida
    try {
      new URL(url);
      // Guardar en localStorage para persistencia
      localStorage.setItem('registration_appscript_url', url);
      console.log('✅ URL de AppScript actualizada:', url);
      return { success: true, message: 'URL configurada correctamente' };
    } catch (error) {
      console.error('❌ URL inválida:', error);
      return { success: false, message: 'URL inválida' };
    }
  } else {
    console.warn('⚠️ URL vacía proporcionada');
    return { success: false, message: 'URL vacía' };
  }
}

// Hacer la función disponible globalmente para facilitar la configuración
if (typeof window !== 'undefined') {
  window.setRegistrationAppScriptUrl = setRegistrationAppScriptUrl;
  window.getRegistrationAppScriptUrl = getRegistrationAppScriptUrl;
  console.log('💡 Para configurar la URL del AppScript, usa: window.setRegistrationAppScriptUrl("TU_URL_AQUI")');
}

/**
 * Obtiene la URL del AppScript para registro
 * @returns {string|null} URL del AppScript o null si no está configurada
 */
export function getRegistrationAppScriptUrl() {
  return APPSCRIPT_URL || null;
}

