import requests
import json

# Télécharger une image de test si elle n'existe pas
import urllib.request
import os

if not os.path.exists("test_bus.jpg"):
    print("Téléchargement de l'image de test...")
    urllib.request.urlretrieve("https://ultralytics.com/images/bus.jpg", "test_bus.jpg")

# Test avec verbose
url = "http://localhost:8001/api/process-image"

with open("test_bus.jpg", "rb") as f:
    files = {"file": ("test_bus.jpg", f, "image/jpeg")}
    response = requests.post(url, files=files)

print(f"Status Code: {response.status_code}")
print(f"Response Headers: {dict(response.headers)}")
print(f"Response Content: {response.text}")

try:
    result = response.json()
    print("JSON parsed successfully")
    print(json.dumps(result, indent=2))
except Exception as e:
    print(f"JSON parse error: {e}")
