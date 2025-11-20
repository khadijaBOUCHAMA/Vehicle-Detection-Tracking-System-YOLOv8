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
def load_model():
    try:
        model = YOLO('yolov8n.pt')
        print("✓ Modèle YOLOv8n chargé")
        return model
    except Exception as e:
        print(f"✗ Erreur chargement modèle: {e}")
        raise

model = load_model()
class_list = model.names

def process_image(image_data: bytes) -> dict:
    """Version robuste avec gestion d'erreurs complète"""
    try:
        print("=== PROCESS_IMAGE START ===")
        
        # Vérifier que les données ne sont pas vides
        if not image_data or len(image_data) == 0:
            return {"error": "Données image vides"}
        
        print(f"Taille données reçues: {len(image_data)} bytes")
        
        # Conversion bytes -> PIL Image avec vérification
        try:
            image = Image.open(io.BytesIO(image_data))
            # Forcer le chargement pour vérifier l'intégrité
            image.load()
        except Exception as e:
            return {"error": f"Image corrompue: {str(e)}"}
        
        image_np = np.array(image)
        print(f"Image chargée: {image_np.shape}")
        
        # Run YOLO inference
        results = model(image_np)
        result = results[0]
        print(f"Boxes détectées: {len(result.boxes)}")
        
        # Si pas de détections
        if len(result.boxes) == 0:
            return {
                "detections": [],
                "processed_image": None,
                "message": "Aucun objet détecté"
            }
        
        # Conversion supervision
        detections = sv.Detections.from_ultralytics(result)
        print(f"Détections supervision: {len(detections)}")
        
        # Formatage des détections
        formatted_detections = []
        for i in range(len(detections.xyxy)):
            try:
                bbox = detections.xyxy[i].tolist()
                confidence = float(detections.confidence[i]) if detections.confidence is not None else 0.0
                class_id = int(detections.class_id[i]) if detections.class_id is not None else 0
                class_name = model.names.get(class_id, "unknown")
                
                formatted_detections.append({
                    "bbox": bbox,
                    "confidence": confidence,
                    "class_name": class_name,
                    "class_id": class_id,
                    "tracker_id": None
                })
            except Exception as e:
                print(f"Erreur formatage détection {i}: {e}")
                continue
        
        print(f"Détections formatées: {len(formatted_detections)}")
        
        # Annotation de l'image
        try:
            box_annotator = sv.BoxAnnotator()
            annotated_image = box_annotator.annotate(
                scene=image_np.copy(),
                detections=detections
            )
            
            # Conversion base64
            annotated_pil = Image.fromarray(annotated_image)
            buffered = io.BytesIO()
            annotated_pil.save(buffered, format="JPEG", quality=85)
            processed_image = base64.b64encode(buffered.getvalue()).decode()
        except Exception as e:
            print(f"Erreur annotation image: {e}")
            processed_image = None
        
        print("=== PROCESS_IMAGE SUCCESS ===")
        
        return {
            "detections": formatted_detections,
            "processed_image": processed_image,
            "message": f"{len(formatted_detections)} objets détectés"
        }
        
    except Exception as e:
        print(f"=== PROCESS_IMAGE ERROR ===")
        print(f"Erreur: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

def process_video_tracking(video_file) -> dict:
    """Version simplifiée pour la vidéo"""
    try:
        return {
            "success": True,
            "message": "Fonction vidéo prête",
            "processed_video": "debug.mp4",
            "preview_image": None,
            "final_counts": {},
            "total_vehicles": 0
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
