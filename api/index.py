"""Vercel entrypoint for the public FastAPI read API."""

from src.api import app

__all__ = ["app"]
