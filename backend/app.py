from fastapi import FastAPI, File, UploadFile, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os

app = FastAPI(title="Autonomous Driving")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Créer le dossier static s'il n'existe pas
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    return {"message": "  Autonomous Driving API", "status": "active"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True}

# Les autres endpoints restent identiques...


@app.post("/api/process-image")
async def process_image_endpoint(file: UploadFile = File(...)):
    try:
        from inference_tracking import process_image
        image_data = await file.read()
        result = process_image(image_data)

        # Vérifier si le résultat contient une erreur
        if "error" in result:
            return {"success": False, "error": result["error"]}

        return {
            "success": True,
            "detections": result.get("detections", []),
            "processed_image": result.get("processed_image")
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


@app.post("/api/process-video")
async def process_video_detection_endpoint(file: UploadFile = File(...)):
    try:
        from inference_tracking import process_video_detection
        result = process_video_detection(file)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.post("/api/process-video-tracking")
async def process_video_tracking_endpoint(file: UploadFile = File(...)):
    try:
        from inference_tracking import process_video_tracking
        result = process_video_tracking(file)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.get("/api/download-video/{filename}")
async def download_video_endpoint(filename: str):
    file_path = os.path.join("static", filename)
    if os.path.exists(file_path):
        return FileResponse(
            file_path,
            media_type="video/mp4",
            filename=filename
        )

    return {"error": "File not found"}


@app.websocket("/ws/live-tracking")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        await websocket.send_text("Connexion WebSocket établie")
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message reçu: {data}")
    except Exception as e:
        print(f"WebSocket error: {e}")


if __name__ == "__main__":
    print("🚀 Démarrage de l'API   Autonomous Driving...")
    uvicorn.run(app, host="0.0.0.0", port=8001)  # Port changé à 8001
