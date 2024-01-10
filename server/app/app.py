from app.routes import api
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "https://mtgcombinator.com",
    "https://www.mtgcombinator.com",
    "https://combinator.pages.dev",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api.router)
