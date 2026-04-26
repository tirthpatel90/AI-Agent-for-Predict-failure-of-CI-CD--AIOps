from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

# Load environment variables securely from .env
load_dotenv()

from routes import github, ai_healer, auth

app = FastAPI(title="AutoHeal CI Backend")

# Allow Next.js frontend to securely access this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Restrict to frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(github.router, prefix="/api/v1/github", tags=["github"])
app.include_router(ai_healer.router, prefix="/api/v1/heal", tags=["heal"])

@app.get("/")
def read_root():
    return {"status": "AutoHeal Backend is active and secure."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
