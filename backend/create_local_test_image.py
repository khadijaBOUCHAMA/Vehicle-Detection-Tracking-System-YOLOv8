from PIL import Image, ImageDraw
import os

# Créer une image de test simple
width, height = 640, 480
image = Image.new('RGB', (width, height), color='lightblue')
draw = ImageDraw.Draw(image)

# Dessiner quelques formes simples
draw.rectangle([50, 50, 200, 150], fill='red', outline='black')  # Rectangle rouge
draw.ellipse([300, 100, 450, 250], fill='green', outline='black')  # Cercle vert
draw.rectangle([100, 300, 350, 400], fill='yellow', outline='black')  # Rectangle jaune

# Sauvegarder
filename = "local_test_image.jpg"
image.save(filename, "JPEG", quality=95)

print(f"✓ Image de test créée: {filename}")
print(f"✓ Taille: {image.size}")
print(f"✓ Format: JPEG")

# Vérifier
file_size = os.path.getsize(filename)
print(f"✓ Taille fichier: {file_size} bytes")

# Test d'ouverture
test_img = Image.open(filename)
print(f"✓ Test ouverture réussi: {test_img.size}")
