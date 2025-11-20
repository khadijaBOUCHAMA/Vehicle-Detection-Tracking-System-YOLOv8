import cv2
import numpy as np
from ultralytics import YOLO
import supervision as sv
from PIL import Image
import base64
import io
import os
from collections import defaultdict

# Charger le modèle
model = YOLO('yolov8n.pt')
class_list = model.names

def debug_process_image():
    """Test local de process_image pour debugger"""
    print("=== DEBUG process_image ===")
    
    # Charger l'image de test
    if not os.path.exists("test_bus.jpg"):
        import urllib.request
        urllib.request.urlretrieve("https://ultralytics.com/images/bus.jpg", "test_bus.jpg")
    
    with open("test_bus.jpg", "rb") as f:
        image_data = f.read()
    
    try:
        print("1. Conversion bytes -> PIL Image...")
        image = Image.open(io.BytesIO(image_data))
        image_np = np.array(image)
        print(f"   Image shape: {image_np.shape}")
        
        print("2. Inference YOLO...")
        results = model(image_np)
        result = results[0]
        print(f"   Nombre de boxes: {len(result.boxes)}")
        
        if len(result.boxes) > 0:
            print("3. Conversion vers Supervision...")
            detections = sv.Detections.from_ultralytics(result)
            print(f"   Type detections: {type(detections)}")
            print(f"   Attr detections: {dir(detections)}")
            print(f"   xyxy shape: {detections.xyxy.shape if hasattr(detections.xyxy, 'shape') else 'N/A'}")
            print(f"   confidence: {detections.confidence}")
            print(f"   class_id: {detections.class_id}")
            print(f"   tracker_id: {detections.tracker_id}")
            
            print("4. Formatage des détections...")
            formatted_detections = []
            for i in range(len(detections.xyxy)):
                bbox = detections.xyxy[i]
                confidence = detections.confidence[i] if detections.confidence is not None else 0.0
                class_id = detections.class_id[i] if detections.class_id is not None else 0
                tracker_id = detections.tracker_id[i] if detections.tracker_id is not None else None
                
                detection_data = {
                    "bbox": bbox.tolist(),
                    "confidence": float(confidence),
                    "class_name": model.names[int(class_id)] if class_id is not None else "unknown",
                    "class_id": int(class_id) if class_id is not None else 0,
                    "tracker_id": int(tracker_id) if tracker_id is not None else None
                }
                formatted_detections.append(detection_data)
                print(f"   Détection {i}: {detection_data['class_name']} ({detection_data['confidence']:.2f})")
            
            print(f"5. Total détections formatées: {len(formatted_detections)}")
            
            # Test de retour
            return {
                "detections": formatted_detections,
                "processed_image": "test_base64",
                "message": "Debug successful"
            }
        else:
            print("   Aucune détection!")
            return {
                "detections": [],
                "processed_image": None,
                "message": "No detections"
            }
            
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

if __name__ == "__main__":
    result = debug_process_image()
    print(f"\\nRésultat final: {result}")
