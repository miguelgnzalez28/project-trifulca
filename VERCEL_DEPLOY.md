# Guía de Deploy en Vercel

## Solución al Error "Code Not Found"

El error ocurre porque Vercel busca el código en la raíz, pero el frontend está en la carpeta `frontend/`.

## Opción 1: Configuración Manual en Vercel (Recomendado)

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **General**
3. En la sección **Root Directory**, configura:
   - **Root Directory**: `frontend`
4. En **Build & Development Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Guarda los cambios y haz un nuevo deploy

## Opción 2: Usar el archivo vercel.json

El archivo `vercel.json` en la raíz ya está configurado. Si Vercel no lo detecta automáticamente:

1. Asegúrate de que el archivo `vercel.json` esté en la raíz del repositorio
2. Vercel debería detectarlo automáticamente en el próximo deploy

## Opción 3: Deploy desde la carpeta frontend

Si las opciones anteriores no funcionan:

1. Crea un nuevo proyecto en Vercel
2. Conecta el repositorio
3. En la configuración, establece el **Root Directory** como `frontend`
4. Vercel detectará automáticamente que es un proyecto Vite

## Variables de Entorno

Si necesitas variables de entorno, agrégalas en Vercel:
- **Settings** → **Environment Variables**

Ejemplo:
- `VITE_BACKEND_URL`: URL de tu backend (ej: `https://tu-backend.vercel.app`)

## Verificación

Después del deploy, verifica que:
- ✅ El build se completa sin errores
- ✅ La aplicación carga correctamente
- ✅ Las rutas funcionan (SPA routing)



