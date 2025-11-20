import urllib.request
import os

print("Téléchargement de test_bus.jpg...")
url = "https://ultralytics.com/images/bus.jpg"
filename = "test_bus.jpg"

try:
    urllib.request.urlretrieve(url, filename)
    print(f"✓ Fichier téléchargé: {filename}")
    
    # Vérifier la taille du fichier
    file_size = os.path.getsize(filename)
    print(f"✓ Taille du fichier: {file_size} bytes")
    
    # Vérifier que c'est une image valide
    from PIL import Image
    try:
        img = Image.open(filename)
        print(f"✓ Image valide: {img.size}, format: {img.format}")
        img.verify()  # Vérifier l'intégrité
        print("✓ Image vérifiée avec succès")
    except Exception as e:
        print(f"✗ Image corrompue: {e}")
        os.remove(filename)  # Supprimer si corrompue
        
except Exception as e:
    print(f"✗ Erreur téléchargement: {e}")
