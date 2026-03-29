"""
Safe-Pay AI — Backend Entry Point
FastAPI application with lifespan events, CORS, and API routing.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.db import init_db
from backend.api.routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database and seed data on startup."""
    print("Safe-Pay AI Backend starting...")
    await init_db()
    print("Database ready")
    yield
    print("Safe-Pay AI Backend shutting down")


app = FastAPI(
    title="Safe-Pay AI",
    description="Multi-agent fraud prevention system for digital payments",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    return {
        "name": "Safe-Pay AI",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
    }
