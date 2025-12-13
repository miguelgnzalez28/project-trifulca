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

