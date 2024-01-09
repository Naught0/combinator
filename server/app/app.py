from app.routes import api
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles


app = FastAPI()

app.include_router(api.router)
app.mount("", StaticFiles(directory="static", html=True))
