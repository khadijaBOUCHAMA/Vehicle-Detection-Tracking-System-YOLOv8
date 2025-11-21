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

def process_video_detection(video_file) -> dict:
    """Traite la vidéo et détecte les véhicules sans tracking"""
    try:
        print("=== PROCESS_VIDEO_DETECTION START ===")
        
        import tempfile
        from pathlib import Path
        
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_video_path = os.path.join(temp_dir, "temp_video.mp4")
            
            video_content = video_file.file.read()
            with open(temp_video_path, 'wb') as f:
                f.write(video_content)
            
            print(f"Vidéo temporaire: {temp_video_path}")
            
            cap = cv2.VideoCapture(temp_video_path)
            if not cap.isOpened():
                return {"success": False, "error": "Impossible d'ouvrir la vidéo"}
            
            fps = cap.get(cv2.CAP_PROP_FPS)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            print(f"Vidéo: {width}x{height}, {fps}fps, {total_frames} frames")
            
            output_video_path = os.path.join("static", f"detection_{int(__import__('time').time())}.mp4")
            os.makedirs("static", exist_ok=True)
            
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))
            
            vehicle_counts = defaultdict(int)
            total_detections = 0
            frame_count = 0
            preview_frame = None
            
            box_annotator = sv.BoxAnnotator()
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                
                results = model(frame)
                result = results[0]
                
                if len(result.boxes) > 0:
                    detections = sv.Detections.from_ultralytics(result)
                    
                    for class_id in result.boxes.cls:
                        class_name = model.names[int(class_id)]
                        vehicle_counts[class_name] += 1
                        total_detections += 1
                    
                    annotated_frame = box_annotator.annotate(
                        scene=frame.copy(),
                        detections=detections
                    )
                else:
                    annotated_frame = frame.copy()
                
                if preview_frame is None:
                    preview_frame = annotated_frame.copy()
                
                out.write(annotated_frame)
                
                if frame_count % 30 == 0:
                    print(f"Traitement frame {frame_count}/{total_frames}")
            
            cap.release()
            out.release()
            
            print(f"Vidéo traitée: {frame_count} frames")
            print(f"Objets détectés: {dict(vehicle_counts)}")
            
            preview_image = None
            if preview_frame is not None:
                preview_pil = Image.fromarray(cv2.cvtColor(preview_frame, cv2.COLOR_BGR2RGB))
                buffered = io.BytesIO()
                preview_pil.save(buffered, format="JPEG", quality=85)
                preview_image = base64.b64encode(buffered.getvalue()).decode()
            
            return {
                "success": True,
                "processed_video": os.path.basename(output_video_path),
                "preview_image": preview_image,
                "final_counts": dict(vehicle_counts),
                "total_vehicles": total_detections
            }
            
    except Exception as e:
        print(f"=== PROCESS_VIDEO_DETECTION ERROR ===")
        print(f"Erreur: {e}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}


def process_video_tracking(video_file) -> dict:
    """Traite la vidéo et détecte les véhicules"""
    try:
        print("=== PROCESS_VIDEO START ===")
        
        import tempfile
        from pathlib import Path
        
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_video_path = os.path.join(temp_dir, "temp_video.mp4")
            
            video_content = video_file.file.read()
            with open(temp_video_path, 'wb') as f:
                f.write(video_content)
            
            print(f"Vidéo temporaire: {temp_video_path}")
            
            cap = cv2.VideoCapture(temp_video_path)
            if not cap.isOpened():
                return {"success": False, "error": "Impossible d'ouvrir la vidéo"}
            
            fps = cap.get(cv2.CAP_PROP_FPS)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            print(f"Vidéo: {width}x{height}, {fps}fps, {total_frames} frames")
            
            output_video_path = os.path.join("static", f"output_{int(__import__('time').time())}.mp4")
            os.makedirs("static", exist_ok=True)
            
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))
            
            vehicle_counts = defaultdict(int)
            total_detections = 0
            frame_count = 0
            preview_frame = None
            
            byte_track = sv.ByteTrack()
            box_annotator = sv.BoxAnnotator()
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                
                results = model(frame)
                result = results[0]
                
                if len(result.boxes) > 0:
                    detections = sv.Detections.from_ultralytics(result)
                    detections = byte_track.update_with_detections(detections)
                    
                    for class_id in result.boxes.cls:
                        class_name = model.names[int(class_id)]
                        vehicle_counts[class_name] += 1
                        total_detections += 1
                    
                    annotated_frame = box_annotator.annotate(
                        scene=frame.copy(),
                        detections=detections
                    )
                else:
                    annotated_frame = frame.copy()
                
                if preview_frame is None:
                    preview_frame = annotated_frame.copy()
                
                out.write(annotated_frame)
                
                if frame_count % 30 == 0:
                    print(f"Traitement frame {frame_count}/{total_frames}")
            
            cap.release()
            out.release()
            
            print(f"Vidéo traitée: {frame_count} frames")
            print(f"Véhicules détectés: {dict(vehicle_counts)}")
            
            preview_image = None
            if preview_frame is not None:
                preview_pil = Image.fromarray(cv2.cvtColor(preview_frame, cv2.COLOR_BGR2RGB))
                buffered = io.BytesIO()
                preview_pil.save(buffered, format="JPEG", quality=85)
                preview_image = base64.b64encode(buffered.getvalue()).decode()
            
            return {
                "success": True,
                "processed_video": os.path.basename(output_video_path),
                "preview_image": preview_image,
                "final_counts": dict(vehicle_counts),
                "total_vehicles": total_detections
            }
            
    except Exception as e:
        print(f"=== PROCESS_VIDEO ERROR ===")
        print(f"Erreur: {e}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}
