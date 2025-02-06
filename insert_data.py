from link_mongoDB import models_collection

from datetime import datetime, timedelta

# today's date
today_date = datetime(2025, 2, 5)

from datetime import datetime, timedelta

today_date = datetime.today()

models_db = [
    {
        "name": "CV_800",
        "category": "3D Object Detection",
        "epochs": 100,
        "accuracy": [round(75 + (i / 100) * 10, 2) for i in range(100)],
        "loss": [round(0.5 - (i / 100) * 0.3, 4) for i in range(100)],
        "training_time": 150,
        "gpu_used": "GPU1",
        "training_date": (today_date - timedelta(days=0)).strftime("%Y-%m-%d")
    },
    {
        "name": "VIT",
        "category": "Sign Detection",
        "epochs": 100,
        "accuracy": [round(72 + (i / 100) * 9, 2) for i in range(100)],
        "loss": [round(0.6 - (i / 100) * 0.25, 4) for i in range(100)],
        "training_time": 140,
        "gpu_used": "GPU2",
        "training_date": (today_date - timedelta(days=0)).strftime("%Y-%m-%d")
    },
    {
        "name": "VIT2",
        "category": "Sign Detection",
        "epochs": 100,
        "accuracy": [round(70 + (i / 100) * 20, 2) for i in range(100)],
        "loss": [round(0.4 - (i / 100) * 0.23, 4) for i in range(100)],
        "training_time": 180,
        "gpu_used": "GPU3",
        "training_date": (today_date - timedelta(days=4)).strftime("%Y-%m-%d")
    },
    {
        "name": "Yolo8",
        "category": "Obstacle Detection",
        "epochs": 100,
        "accuracy": [round(68 + (i / 100) * 11, 2) for i in range(100)],
        "loss": [round(0.7 - (i / 100) * 0.35, 4) for i in range(100)],
        "training_time": 160,
        "gpu_used": "GPU1",
        "training_date": (today_date - timedelta(days=6)).strftime("%Y-%m-%d")
    },
    {
        "name": "YoloV2",
        "category": "3D Object Detection",
        "epochs": 100,
        "accuracy": [round(62 + (i / 100) * 22, 2) for i in range(100)],
        "loss": [round(0.8 - (i / 100) * 0.4, 4) for i in range(100)],
        "training_time": 190,
        "gpu_used": "GPU2",
        "training_date": (today_date - timedelta(days=8)).strftime("%Y-%m-%d")
    },
    {
        "name": "random_stuff",
        "category": "Obstacle Detection",
        "epochs": 100,
        "accuracy": [round(63 + (i / 100) * 21, 2) for i in range(100)],
        "loss": [round(0.8 - (i / 100) * 0.1, 4) for i in range(100)],
        "training_time": 120,
        "gpu_used": "GPU3",
        "training_date": (today_date - timedelta(days=10)).strftime("%Y-%m-%d")
    },
    {
        "name": "CV_Cars",
        "category": "3D Object Detection",
        "epochs": 100,
        "accuracy": [round(55 + (i / 100) * 11, 2) for i in range(100)],
        "loss": [round(0.5 - (i / 100) * 0.2, 4) for i in range(100)],
        "training_time": 130,
        "gpu_used": "GPU1",
        "training_date": (today_date - timedelta(days=12)).strftime("%Y-%m-%d")
    },
    {
        "name": "Model",
        "category": "Sign Detection",
        "epochs": 100,
        "accuracy": [round(70 + (i / 100) * 15, 2) for i in range(100)],
        "loss": [round(0.6 - (i / 100) * 0.4, 4) for i in range(100)],
        "training_time": 175,
        "gpu_used": "GPU2",
        "training_date": (today_date - timedelta(days=16)).strftime("%Y-%m-%d")
    },
    {
        "name": "human_detection",
        "category": "Obstacle Detection",
        "epochs": 100,
        "accuracy": [round(40 + (i / 100) * 21, 2) for i in range(100)],
        "loss": [round(0.5 - (i / 100) * 0.1, 4) for i in range(100)],
        "training_time": 110,
        "gpu_used": "GPU1",
        "training_date": (today_date - timedelta(days=50)).strftime("%Y-%m-%d")
    },
    {
        "name": "LaneNet",
        "category": "Lane Detection",
        "epochs": 100,
        "accuracy": [round(60 + (i / 100) * 20, 2) for i in range(100)],
        "loss": [round(0.55 - (i / 100) * 0.3, 4) for i in range(100)],
        "training_time": 160,
        "gpu_used": "GPU2",
        "training_date": (today_date - timedelta(days=20)).strftime("%Y-%m-%d")
    },
    {
        "name": "FastRCNN",
        "category": "3D Object Detection",
        "epochs": 100,
        "accuracy": [round(50 + (i / 100) * 30, 2) for i in range(100)],
        "loss": [round(0.7 - (i / 100) * 0.35, 4) for i in range(100)],
        "training_time": 200,
        "gpu_used": "GPU3",
        "training_date": (today_date - timedelta(days=25)).strftime("%Y-%m-%d")
    },
    {
        "name": "MaskRCNN",
        "category": "3D Object Detection",
        "epochs": 100,
        "accuracy": [round(55 + (i / 100) * 25, 2) for i in range(100)],
        "loss": [round(0.65 - (i / 100) * 0.4, 4) for i in range(100)],
        "training_time": 190,
        "gpu_used": "GPU1",
        "training_date": (today_date - timedelta(days=30)).strftime("%Y-%m-%d")
    }
]


models_collection.delete_many({})  
models_collection.insert_many(models_db)  

print("Data inserted successfully!")
