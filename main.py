from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import date

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client["models_db"]
models_collection = db["models"]

class ModelSchema(BaseModel):
    name: str
    category: str
    epochs: int
    accuracy: List[float]
    loss: List[float]
    training_time: int
    gpu_used: str
    training_date: date

def serialize_model(model):
    return {
        "_id": str(model["_id"]),  
        "name": model["name"],
        "category": model["category"],
        "epochs": model["epochs"],
        "accuracy": model["accuracy"],
        "loss": model["loss"],
        "training_time": model["training_time"],
        "gpu_used": model["gpu_used"],
        "training_date": model["training_date"]
    }

# models endpoint
@app.get("/models")
async def get_models():
    models_cursor = models_collection.find()
    models_list = await models_cursor.to_list(length=None)
    return [serialize_model(model) for model in models_list]

#compare endpoint
class CompareRequest(BaseModel):
    models: List[str]

@app.post("/compare")
async def compare_models(request: CompareRequest):
    response_data = {"epochs": 100}

    selected_models = await models_collection.find({"name": {"$in": request.models}}).to_list(100)

    for model in selected_models:
        response_data[model["name"]] = {
            "accuracy": model["accuracy"],
            "loss": model["loss"]
        }

    return response_data

# Close MongoDB connection when FastAPI shuts down
@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
