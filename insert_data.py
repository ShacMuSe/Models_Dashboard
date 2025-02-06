from link_mongoDB import models_collection
import numpy as np
from datetime import datetime, timedelta

today_date = datetime.today()



models_db = [
    {
        "name": "CV_800",
        "category": "3D Object Detection",
        "epochs": 100,
        "accuracy": [round(75 + 10 * (np.log(1 + i) / np.log(100)), 2) for i in range(100)],
        "loss": [round(0.5 - 0.3 * (np.log(1 + i) / np.log(100)), 4) for i in range(100)],
        "training_time": 150,
        "gpu_used": "GPU1",
        "training_date": (today_date - timedelta(days=0)).strftime("%Y-%m-%d")
    },
    {
        "name": "VIT",
        "category": "Sign Detection",
        "epochs": 100,
        "accuracy": [round(72 + 9 * (np.log(1 + i) / np.log(100)), 2) for i in range(100)],
        "loss": [round(0.6 - 0.25 * (np.log(1 + i) / np.log(100)), 4) for i in range(100)],
        "training_time": 140,
        "gpu_used": "GPU2",
        "training_date": (today_date - timedelta(days=0)).strftime("%Y-%m-%d")
    },
    {
        "name": "VIT2",
        "category": "Sign Detection",
        "epochs": 100,
        "accuracy": [round(70 + 20 * (np.log(1 + i) / np.log(100)), 2) for i in range(100)],
        "loss": [round(0.4 - 0.23 * (np.log(1 + i) / np.log(100)), 4) for i in range(100)],
        "training_time": 180,
        "gpu_used": "GPU3",
        "training_date": (today_date - timedelta(days=4)).strftime("%Y-%m-%d")
    },
    {
        "name": "Yolo8",
        "category": "Obstacle Detection",
        "epochs": 100,
        "accuracy": [round(68 + 11 * (np.log(1 + i) / np.log(100)), 2) for i in range(100)],
        "loss": [round(0.7 - 0.35 * (np.log(1 + i) / np.log(100)), 4) for i in range(100)],
        "training_time": 160,
        "gpu_used": "GPU1",
        "training_date": (today_date - timedelta(days=6)).strftime("%Y-%m-%d")
    },
    {
        "name": "YoloV2",
        "category": "3D Object Detection",
        "epochs": 100,
        "accuracy": [round(62 + 22 * (np.log(1 + i) / np.log(100)), 2) for i in range(100)],
        "loss": [round(0.8 - 0.4 * (np.log(1 + i) / np.log(100)), 4) for i in range(100)],
        "training_time": 190,
        "gpu_used": "GPU2",
        "training_date": (today_date - timedelta(days=0)).strftime("%Y-%m-%d")
    },
    {
        "name": "random_stuff",
        "category": "Obstacle Detection",
        "epochs": 100,
        "accuracy": [round(63 + 21 * (np.log(1 + i) / np.log(100)), 2) for i in range(100)],
        "loss": [round(0.8 - 0.1 * (np.log(1 + i) / np.log(100)), 4) for i in range(100)],
        "training_time": 120,
        "gpu_used": "GPU3",
        "training_date": (today_date - timedelta(days=10)).strftime("%Y-%m-%d")
    },
    {
        "name": "CV_Cars",
        "category": "3D Object Detection",
        "epochs": 100,
        "accuracy": [round(55 + 11 * (np.log(1 + i) / np.log(100)), 2) for i in range(100)],
        "loss": [round(0.5 - 0.2 * (np.log(1 + i) / np.log(100)), 4) for i in range(100)],
        "training_time": 130,
        "gpu_used": "GPU1",
        "training_date": (today_date - timedelta(days=12)).strftime("%Y-%m-%d")
    },
    {
        "name": "Model",
        "category": "Sign Detection",
        "epochs": 100,
        "accuracy": [round(70 + 15 * (np.log(1 + i) / np.log(100)), 2) for i in range(100)],
        "loss": [round(0.6 - 0.4 * (np.log(1 + i) / np.log(100)), 4) for i in range(100)],
        "training_time": 175,
        "gpu_used": "GPU2",
        "training_date": (today_date - timedelta(days=16)).strftime("%Y-%m-%d")
    },
    {
        "name": "human_detection",
        "category": "Obstacle Detection",
        "epochs": 100,
        "accuracy": [round(40 + 21 * (np.log(1 + i) / np.log(100)), 2) for i in range(100)],
        "loss": [round(0.5 - 0.1 * (np.log(1 + i) / np.log(100)), 4) for i in range(100)],
        "training_time": 110,
        "gpu_used": "GPU1",
        "training_date": (today_date - timedelta(days=50)).strftime("%Y-%m-%d")
    },
    {
        "name": "LaneNet",
        "category": "Lane Detection",
        "epochs": 100,
        "accuracy": [round(60 + 20 * (np.log(1 + i) / np.log(100)), 2) for i in range(100)],
        "loss": [round(0.55 - 0.3 * (np.log(1 + i) / np.log(100)), 4) for i in range(100)],
        "training_time": 160,
        "gpu_used": "GPU2",
        "training_date": (today_date - timedelta(days=20)).strftime("%Y-%m-%d")
    },
    {
        "name": "FastRCNN",
        "category": "3D Object Detection",
        "epochs": 100,
        "accuracy": [round(50 + 30 * (np.log(1 + i) / np.log(100)), 2) for i in range(100)],
        "loss": [round(0.7 - 0.35 * (np.log(1 + i) / np.log(100)), 4) for i in range(100)],
        "training_time": 200,
        "gpu_used": "GPU3",
        "training_date": (today_date - timedelta(days=25)).strftime("%Y-%m-%d")
    },
    {
        "name": "MaskRCNN",
        "category": "3D Object Detection",
        "epochs": 100,
        "accuracy": [round(55 + 25 * (np.log(1 + i) / np.log(100)), 2) for i in range(100)],
        "loss": [round(0.65 - 0.4 * (np.log(1 + i) / np.log(100)), 4) for i in range(100)],
        "training_time": 190,
        "gpu_used": "GPU1",
        "training_date": (today_date - timedelta(days=30)).strftime("%Y-%m-%d")
    }
]



models_collection.delete_many({})  
models_collection.insert_many(models_db)  

print("Data inserted successfully!")
