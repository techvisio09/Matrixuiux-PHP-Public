from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import logging
import os

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

from database import client
from seed import seed_all
from routes import catalog, auth, orders, payments, chat, admin

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="UCODE SOFTTECH Store API")

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "UCODE SOFTTECH Store API", "status": "ok"}


api_router.include_router(catalog.router)
api_router.include_router(auth.router)
api_router.include_router(orders.router)
api_router.include_router(payments.router)
api_router.include_router(chat.router)
api_router.include_router(admin.router)
app.include_router(api_router)

# CORS: echo the request origin (required for cookie credentials; wildcard '*' is
# rejected by browsers when allow_credentials=True)
cors_origins = os.environ.get('CORS_ORIGINS', '*')
if cors_origins == '*':
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex='.*',
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins.split(','),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.on_event("startup")
async def startup():
    await seed_all()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
