import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import api

app = FastAPI()
origins = ["https://mtgcombinator.com"]
if os.getenv("ENV", "").startswith("dev"):
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


app.include_router(api.router)
