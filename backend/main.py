from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Analytics Hackathon API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Analytics API is running"}

@app.get("/api/dashboard/summary")
def get_summary():
    return {
        "total_requests": "124,563",
        "peak_load": "840 RPS",
        "avg_response": "112 ms",
        "error_rate": "0.04%"
    }
