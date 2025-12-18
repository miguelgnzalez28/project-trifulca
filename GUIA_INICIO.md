# 🚀 Guía de Inicio - Project Trifulca

Esta guía te ayudará a iniciar el programa para ejecutar pruebas.

## 📋 Requisitos Previos

1. **Python 3.8+** instalado
2. **Node.js 16+** y **npm** instalados
3. **MongoDB** - Base de datos (puede ser local o remota como MongoDB Atlas)
4. **Variables de entorno** configuradas en el backend

## 🔧 Configuración Inicial

### 1. Configurar el Backend

#### a) Instalar dependencias de Python

Abre una terminal en la carpeta del proyecto y ejecuta:

```powershell
cd backend
pip install -r requirements.txt
```

#### b) Configurar variables de entorno

Crea o edita el archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
MONGO_URL=mongodb://localhost:27017
# O si usas MongoDB Atlas:
# MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net

DB_NAME=trifulca_db
JWT_SECRET_KEY=tu_clave_secreta_aqui_puede_ser_cualquier_string_largo
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**Nota:** Si no tienes MongoDB instalado localmente, puedes usar [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratis) y usar la URL de conexión que te proporcionen.

### 2. Configurar el Frontend

#### a) Instalar dependencias de Node.js

Abre una terminal en la carpeta del frontend y ejecuta:

```powershell
cd frontend
npm install
```

#### b) Configurar URL del backend (opcional)

Si tu backend corre en un puerto diferente a 8000, crea un archivo `.env` en la carpeta `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:8000
```

## ▶️ Iniciar el Programa

Necesitas ejecutar **dos terminales** al mismo tiempo: una para el backend y otra para el frontend.

### Terminal 1: Backend (FastAPI)

```powershell
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Deberías ver algo como:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Application startup complete.
```

### Terminal 2: Frontend (React + Vite)

```powershell
cd frontend
npm run dev
```

Deberías ver algo como:
```
  VITE v4.4.0  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## 🌐 Acceder a la Aplicación

Una vez que ambos servidores estén corriendo:

1. **Frontend:** Abre tu navegador en `http://localhost:3000`
2. **Backend API:** Puedes probar la API en `http://localhost:8000/api/`
3. **Documentación de la API:** `http://localhost:8000/docs` (Swagger UI automático de FastAPI)

## ✅ Verificar que Todo Funciona

### Probar el Backend

Abre en tu navegador: `http://localhost:8000/docs`

Deberías ver la documentación interactiva de la API donde puedes probar los endpoints.

### Probar el Frontend

Abre en tu navegador: `http://localhost:3000`

Deberías ver la aplicación web funcionando.

## 🛠️ Comandos Útiles

### Backend
- **Iniciar servidor:** `uvicorn server:app --reload --host 0.0.0.0 --port 8000`
- **Instalar dependencias:** `pip install -r requirements.txt`

### Frontend
- **Modo desarrollo:** `npm run dev`
- **Compilar para producción:** `npm run build`
- **Previsualizar build:** `npm run preview`
- **Instalar dependencias:** `npm install`

## 🐛 Solución de Problemas

### Error: "MONGO_URL not found"
- Asegúrate de tener el archivo `.env` en la carpeta `backend/` con la variable `MONGO_URL`

### Error: "Port 8000 already in use"
- Cambia el puerto: `uvicorn server:app --reload --host 0.0.0.0 --port 8001`
- Actualiza `VITE_BACKEND_URL` en el frontend si cambias el puerto

### Error: "Port 3000 already in use"
- Vite te sugerirá usar otro puerto automáticamente
- O cambia el puerto en `vite.config.js`

### Error: "Cannot connect to MongoDB"
- Verifica que MongoDB esté corriendo (si es local)
- Verifica la URL de conexión en `.env`
- Si usas MongoDB Atlas, verifica que tu IP esté en la whitelist

## 📝 Notas Importantes

- El backend debe estar corriendo **antes** de que el frontend intente hacer peticiones
- Ambos servidores deben estar corriendo simultáneamente
- El backend corre en el puerto **8000** por defecto
- El frontend corre en el puerto **3000** por defecto
- El modo `--reload` en uvicorn recarga automáticamente cuando cambias código

## 🎯 Próximos Pasos

Una vez que todo esté funcionando:
1. Prueba la funcionalidad de registro/login
2. Explora los productos
3. Prueba el panel de administración (si tienes permisos de admin)
4. Revisa la documentación de la API en `/docs`

¡Listo! Ya puedes ejecutar pruebas en tu aplicación. 🎉





