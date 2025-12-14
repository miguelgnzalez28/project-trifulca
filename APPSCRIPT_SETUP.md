# Configuración del Google Apps Script para Registro de Usuarios

## URL del AppScript
```
https://script.google.com/macros/s/AKfycby6QD2j4jPufk8iy3xTuo7v_IO_xUV2VwAj7xVRRhXPgrkthdtN1ndmnkqZXH1kFc1g/exec
```

## Código necesario en Google Apps Script

Para que el AppScript reciba los datos de registro, necesitas crear una función `doPost` que procese los datos:

```javascript
function doPost(e) {
  try {
    // Obtener los datos del formulario
    const name = e.parameter.name || '';
    const email = e.parameter.email || '';
    const password = e.parameter.password || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    const source = e.parameter.source || 'web_app';
    
    // Aquí puedes guardar los datos en una hoja de Google Sheets
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Agregar una fila con los datos
    sheet.appendRow([
      new Date(),           // Fecha de registro
      name,                // Nombre
      email,               // Email
      password,            // Contraseña (considera hashearla)
      timestamp,           // Timestamp
      source              // Origen
    ]);
    
    // Retornar respuesta exitosa
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: 'Usuario registrado correctamente'
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Retornar error
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Función alternativa para recibir datos via GET (si POST no funciona)
function doGet(e) {
  try {
    const name = e.parameter.name || '';
    const email = e.parameter.email || '';
    const password = e.parameter.password || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    const source = e.parameter.source || 'web_app';
    
    // Guardar en Google Sheets
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date(),
      name,
      email,
      password,
      timestamp,
      source
    ]);
    
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: 'Usuario registrado correctamente'
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Configuración de la Web App

1. Ve a **Publicar > Implementar como aplicación web**
2. Configura:
   - **Ejecutar como**: Tu cuenta
   - **Quién tiene acceso**: Cualquiera (incluso anónimos)
3. Copia la URL de la aplicación web
4. Asegúrate de que la URL coincida con la del código

## Datos que se envían

El frontend envía los siguientes datos:
- `name`: Nombre del usuario
- `email`: Email del usuario
- `password`: Contraseña (considera hashearla en el AppScript)
- `timestamp`: Fecha y hora del registro en formato ISO
- `source`: "web_app"

## Notas de seguridad

⚠️ **IMPORTANTE**: 
- La contraseña se envía en texto plano. Considera hashearla en el AppScript antes de guardarla.
- Usa HTTPS siempre.
- Considera validar los datos antes de guardarlos.

---

# Configuración del Google Apps Script para Catálogo de Productos

## Problema común: El catálogo no se visualiza en móviles

Si el catálogo se visualiza en computadora pero no en teléfono, el problema suele ser de **CORS (Cross-Origin Resource Sharing)**.

## Solución: Configurar el AppScript correctamente

### 1. Función doGet para el catálogo (con headers CORS)

El AppScript que devuelve productos debe incluir headers CORS en la respuesta:

```javascript
function doGet(e) {
  try {
    // Obtener datos de tu hoja de Google Sheets o fuente de datos
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Productos');
    const data = sheet.getDataRange().getValues();
    
    // Convertir a formato JSON
    const headers = data[0];
    const products = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const product = {};
      headers.forEach((header, index) => {
        product[header] = row[index];
      });
      products.push(product);
    }
    
    // IMPORTANTE: Crear respuesta con headers CORS
    const output = ContentService.createTextOutput(JSON.stringify(products));
    output.setMimeType(ContentService.MimeType.JSON);
    
    // Agregar headers CORS para permitir acceso desde cualquier origen
    // Esto es CRÍTICO para que funcione en móviles
    return output;
    
  } catch (error) {
    const errorResponse = {
      error: true,
      message: error.toString()
    };
    const output = ContentService.createTextOutput(JSON.stringify(errorResponse));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}
```

### 2. Configuración de la Web App (CRÍTICO)

1. Ve a **Publicar > Implementar como aplicación web**
2. **Configuración IMPORTANTE**:
   - **Ejecutar como**: Tu cuenta
   - **Quién tiene acceso**: **Cualquiera (incluso anónimos)** ⚠️ ESTO ES ESENCIAL
3. Copia la URL de la aplicación web
4. **Actualiza la versión** si haces cambios (crea una nueva versión)

### 3. Verificar que funcione en móviles

Después de configurar, prueba:

1. **En computadora**: Abre la consola del navegador (F12) y verifica que no haya errores de CORS
2. **En móvil**: 
   - Abre la aplicación en tu teléfono
   - Si tienes acceso a las herramientas de desarrollador remotas, verifica la consola
   - Busca errores como: "CORS policy", "Failed to fetch", "Network error"

### 4. URLs del AppScript en el proyecto

El proyecto usa estas URLs:
- **Catálogo de productos**: Configurada en `frontend/index.html` y `frontend/src/config.js`
- **Registro de usuarios**: Configurada en `frontend/src/services/registrationService.js`

### 5. Solución alternativa: Usar un proxy backend

Si el AppScript directo sigue fallando en móviles, el proyecto intenta usar un proxy backend automáticamente. Asegúrate de que:

1. El backend esté configurado y corriendo
2. La variable de entorno `VITE_BACKEND_URL` esté configurada en Vercel
3. El endpoint `/api/products` esté funcionando correctamente

### 6. Debugging en móviles

Para diagnosticar problemas en móviles:

1. **Chrome DevTools remoto**:
   - Conecta tu teléfono por USB
   - En Chrome, ve a `chrome://inspect`
   - Inspecciona tu aplicación móvil

2. **Logs en consola**:
   - El código ahora incluye logs detallados que indican si es un problema de CORS
   - Busca mensajes que empiecen con `[productsService]`

3. **Verificar la URL**:
   - Asegúrate de que la URL del AppScript sea accesible desde el navegador móvil
   - Prueba abrir la URL directamente en el navegador del teléfono

## Checklist de verificación

- [ ] AppScript configurado como "Cualquiera puede acceder"
- [ ] Función `doGet` devuelve JSON con `ContentService.MimeType.JSON`
- [ ] URL del AppScript correcta en `frontend/index.html`
- [ ] No hay errores de CORS en la consola del navegador
- [ ] Backend proxy configurado (opcional pero recomendado)
- [ ] Probado en dispositivo móvil real (no solo emulador)

