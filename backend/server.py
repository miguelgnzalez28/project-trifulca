from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import hashlib
import secrets
import jwt
import httpx
from urllib.parse import urlparse, parse_qs


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection (opcional - solo para funcionalidades que lo requieren)
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'ultimate_kits')
client = None
db = None

try:
    if mongo_url and db_name:
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        logger_temp = logging.getLogger(__name__)
        logger_temp.info("MongoDB conectado")
except Exception as e:
    logger_temp = logging.getLogger(__name__)
    logger_temp.warning(f"MongoDB no disponible: {e}. El servidor funcionará solo como proxy de imágenes.")

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Security
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Helper Functions
def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current authenticated user"""
    token = credentials.credentials
    payload = verify_token(token)
    return payload

async def get_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    """Verify user is admin"""
    if not current_user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    is_admin: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None
    is_admin: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    is_admin: bool
    created_at: datetime
    last_login: Optional[datetime] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class Visit(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    page: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_id: Optional[str] = None

class AdminStats(BaseModel):
    total_visits: int
    total_users: int
    registered_visits: int
    anonymous_visits: int
    users: List[dict]
    recent_visits: List[dict]


# Middleware for tracking visits
@app.middleware("http")
async def track_visits(request: Request, call_next):
    response = await call_next(request)
    
    # Only track page views (GET requests to main pages)
    if request.method == "GET" and not request.url.path.startswith("/api"):
        session_id = request.cookies.get("session_id")
        if not session_id:
            session_id = str(uuid.uuid4())
            response.set_cookie(key="session_id", value=session_id, max_age=30*24*60*60)
        
        # Get user_id from token if present
        user_id = None
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            try:
                token = auth_header.split(" ")[1]
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                user_id = payload.get("sub")
            except:
                pass
        
        # Save visit
        visit = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "page": str(request.url.path),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "user_id": user_id
        }
        await db.visits.insert_one(visit)
    
    return response


# Auth Routes
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate, request: Request):
    """Register a new user"""
    try:
        # Verificar que MongoDB esté disponible
        if not db:
            raise HTTPException(status_code=503, detail="Database not available. Please check MongoDB connection.")
        
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user_id = str(uuid.uuid4())
        hashed_password = hash_password(user_data.password)
        now = datetime.now(timezone.utc)
        
        # Obtener información adicional del request
        client_ip = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent", None)
        
        user = {
            "id": user_id,
            "email": user_data.email,
            "password": hashed_password,
            "name": user_data.name,
            "is_admin": user_data.is_admin,
            "created_at": now,
            "last_login": None,
            "registration_ip": client_ip,
            "registration_user_agent": user_agent,
            "login_count": 0
        }
        
        await db.users.insert_one(user)
        
        # Registrar el evento de registro
        registration_log = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "event_type": "registration",
            "timestamp": now,
            "ip_address": client_ip,
            "user_agent": user_agent
        }
        await db.user_logs.insert_one(registration_log)
        
        access_token = create_access_token({"sub": user_id, "email": user_data.email, "is_admin": user_data.is_admin})
        
        return TokenResponse(
            access_token=access_token,
            user=UserResponse(
                id=user_id,
                email=user_data.email,
                name=user_data.name,
                is_admin=user_data.is_admin,
                created_at=user["created_at"],
                last_login=None
            )
        )
    except HTTPException:
        # Re-lanzar HTTPException para que se maneje correctamente
        raise
    except Exception as e:
        # Capturar cualquier otro error y retornar un error 500 con mensaje claro
        logger.error(f"Error en registro: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error al registrar usuario: {str(e)}")

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin, request: Request):
    """Login user"""
    try:
        # Verificar que MongoDB esté disponible
        if not db:
            raise HTTPException(status_code=503, detail="Database not available. Please check MongoDB connection.")
        
        user = await db.users.find_one({"email": credentials.email})
        if not user or not verify_password(credentials.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Actualizar información de último login
        now = datetime.now(timezone.utc)
        client_ip = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent", None)
        login_count = user.get("login_count", 0) + 1
        
        await db.users.update_one(
            {"id": user["id"]},
            {
                "$set": {
                    "last_login": now,
                    "last_login_ip": client_ip,
                    "last_login_user_agent": user_agent,
                    "login_count": login_count
                }
            }
        )
        
        # Registrar el evento de login
        login_log = {
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "event_type": "login",
            "timestamp": now,
            "ip_address": client_ip,
            "user_agent": user_agent
        }
        await db.user_logs.insert_one(login_log)
        
        access_token = create_access_token({"sub": user["id"], "email": user["email"], "is_admin": user.get("is_admin", False)})
        
        return TokenResponse(
            access_token=access_token,
            user=UserResponse(
                id=user["id"],
                email=user["email"],
                name=user.get("name"),
                is_admin=user.get("is_admin", False),
                created_at=user["created_at"],
                last_login=now
            )
        )
    except HTTPException:
        # Re-lanzar HTTPException para que se maneje correctamente
        raise
    except Exception as e:
        # Capturar cualquier otro error y retornar un error 500 con mensaje claro
        logger.error(f"Error en login: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error al iniciar sesión: {str(e)}")

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    user = await db.users.find_one({"id": current_user["sub"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user.get("name"),
        is_admin=user.get("is_admin", False),
        created_at=user["created_at"],
        last_login=user.get("last_login")
    )


# Admin Routes
@api_router.get("/admin/stats", response_model=AdminStats)
async def get_stats(admin: dict = Depends(get_admin_user)):
    """Get admin statistics"""
    # Total visits
    total_visits = await db.visits.count_documents({})
    
    # Total users
    total_users = await db.users.count_documents({})
    
    # Registered vs anonymous visits
    registered_visits = await db.visits.count_documents({"user_id": {"$ne": None}})
    anonymous_visits = total_visits - registered_visits
    
    # Get users list
    users_cursor = db.users.find({}, {"_id": 0, "password": 0}).sort("created_at", -1)
    users = await users_cursor.to_list(1000)
    
    # Recent visits
    recent_visits_cursor = db.visits.find({}, {"_id": 0}).sort("timestamp", -1).limit(50)
    recent_visits = await recent_visits_cursor.to_list(50)
    
    return AdminStats(
        total_visits=total_visits,
        total_users=total_users,
        registered_visits=registered_visits,
        anonymous_visits=anonymous_visits,
        users=users,
        recent_visits=recent_visits
    )


# Proxy route para productos de Google Drive (evita CORS)
def extract_drive_file_id(url: str) -> str | None:
    try:
        parsed = urlparse(url)
        if "drive.google.com" in parsed.netloc:
            query = parse_qs(parsed.query)
            if "id" in query and query["id"]:
                return query["id"][0]
            # formats like /file/d/<id>/view
            parts = parsed.path.split("/")
            for idx, part in enumerate(parts):
                if part == "d" and idx + 1 < len(parts):
                    return parts[idx + 1]
        if "googleusercontent.com" in parsed.netloc:
            parts = parsed.path.split("/")
            if "d" in parts:
                idx = parts.index("d")
                if idx + 1 < len(parts):
                    return parts[idx + 1]
    except Exception:
        pass
    return None


def build_proxy_url(base_url: str, file_id: str, size: str = "w1000") -> str:
    return f"{base_url.rstrip('/')}/api/products/image/{file_id}?size={size}"


@api_router.get("/products")
async def get_products(request: Request):
    """Proxy para obtener productos desde Google Apps Script"""
    logger.info("Solicitud recibida en /api/products")
    try:
        url = "https://script.google.com/macros/s/AKfycbwJeBmEY53VYRy_axC-aVJ-rhXxHmTnWTbObJugG4G2soVW_Bo_SyUqXytu6oKtR8c/exec"
        logger.info(f"Obteniendo productos desde: {url}")
        async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()

            if isinstance(data, list):
                base_backend_url = str(request.base_url).rstrip("/")
                for item in data:
                    images = item.get("images")
                    if isinstance(images, list):
                        original_images = images.copy()
                        proxied = []
                        for image_url in images:
                            file_id = extract_drive_file_id(image_url)
                            if file_id:
                                proxied.append(build_proxy_url(base_backend_url, file_id))
                            else:
                                proxied.append(image_url)
                        item["original_images"] = original_images
                        item["images"] = proxied
                    elif isinstance(images, str):
                        file_id = extract_drive_file_id(images)
                        if file_id:
                            item["original_images"] = [images]
                            item["images"] = [build_proxy_url(base_backend_url, file_id)]
                logger.info(f"Productos obtenidos: {len(data)}")

            return data
    except httpx.HTTPError as e:
        logger.error(f"Error HTTP obteniendo productos: {e}")
        raise HTTPException(status_code=500, detail=f"Error HTTP obteniendo productos: {str(e)}")
    except Exception as e:
        logger.error(f"Error obteniendo productos: {e}")
        logger.error(f"Tipo de error: {type(e).__name__}")
        raise HTTPException(status_code=500, detail=f"Error obteniendo productos: {str(e)}")


@api_router.get("/products/image/{file_id}")
async def get_drive_image(file_id: str, size: str = "w1000"):
    """
    Proxy para servir imágenes públicas de Google Drive como JPEGs accesibles.
    Intenta múltiples formatos de URL para mayor compatibilidad.
    """
    # Intentar diferentes formatos de URL en orden de prioridad
    drive_urls = [
        f"https://drive.google.com/thumbnail?id={file_id}&sz={size}",
        f"https://drive.google.com/uc?export=view&id={file_id}",
        f"https://drive.google.com/uc?export=download&id={file_id}",
        f"https://lh3.googleusercontent.com/d/{file_id}={size}",
        f"https://drive.googleusercontent.com/uc?id={file_id}&export=view",
    ]
    
    logger.info(f"Obteniendo imagen de Drive (ID: {file_id}, tamaño: {size})")
    
    for drive_url in drive_urls:
        try:
            async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
                response = await client.get(
                    drive_url, 
                    headers={
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
                        "Referer": "https://drive.google.com/"
                    }
                )
                response.raise_for_status()
                content_type = response.headers.get("content-type", "image/jpeg")
                logger.info(f"✅ Imagen obtenida exitosamente desde: {drive_url}")
                return Response(content=response.content, media_type=content_type)
        except httpx.HTTPStatusError as e:
            logger.warn(f"⚠️ Error HTTP ({e.response.status_code}) con URL: {drive_url}")
            continue
        except Exception as e:
            logger.warn(f"⚠️ Error con URL {drive_url}: {e}")
            continue
    
    # Si ninguna URL funcionó, retornar error
    logger.error(f"❌ No se pudo obtener la imagen {file_id} con ninguna URL")
    raise HTTPException(status_code=404, detail="No se pudo obtener la imagen de Drive")


# Overlay estático para asegurar imágenes de Drive recientes
# Original routes
@api_router.get("/")
async def root():
    return {"message": "Ultimate Kits API"}


# Configurar CORS ANTES de incluir el router para que funcione en todos los endpoints
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # Permitir todos los orígenes para desarrollo
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include the router in the main app
app.include_router(api_router)

# Configure logging ANTES del exception handler
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Exception handler global para asegurar que siempre se incluyan headers CORS
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Maneja todas las excepciones y asegura que siempre se incluyan headers CORS"""
    from fastapi.responses import JSONResponse
    
    # Determinar el código de estado
    if isinstance(exc, HTTPException):
        status_code = exc.status_code
        detail = exc.detail
    else:
        status_code = 500
        detail = str(exc) if str(exc) else "Internal server error"
        logger.error(f"Error no manejado: {exc}", exc_info=True)
    
    # Crear respuesta con headers CORS
    response = JSONResponse(
        status_code=status_code,
        content={"detail": detail},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
        }
    )
    return response


@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()