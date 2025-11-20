import urllib.request
import requests
import os

# Essayer plusieurs images avec des véhicules
image_urls = [
    "https://ultralytics.com/images/bus.jpg",
    "https://ultralytics.com/images/zidane.jpg", 
    "https://github.com/ultralytics/yolov5/raw/master/data/images/zidane.jpg"
]

for i, url in enumerate(image_urls):
    filename = f"real_vehicle_{i}.jpg"
    try:
        print(f"Téléchargement {filename}...")
        urllib.request.urlretrieve(url, filename)
        
        # Vérifier la taille
        size = os.path.getsize(filename)
        print(f"✓ {filename}: {size} bytes")
        
        # Vérifier avec PIL
        from PIL import Image
        img = Image.open(filename)
        print(f"✓ Image valide: {img.size}")
        
    except Exception as e:
        print(f"✗ Erreur {filename}: {e}")
        if os.path.exists(filename):
            os.remove(filename)
