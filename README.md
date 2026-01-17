# Autonomous Driving YOLO8

A comprehensive vehicle detection and tracking system for autonomous driving applications using YOLOv8 and modern web technologies.

## 🚗 Overview

This project implements an end-to-end solution for vehicle detection and tracking in images and videos. It combines a powerful FastAPI backend with YOLOv8 for computer vision tasks and a modern React frontend for an intuitive user experience.

## ✨ Features

- **Image Processing**: Upload and process images to detect vehicles with bounding boxes and confidence scores
- **Video Detection**: Process videos to detect vehicles frame-by-frame
- **Video Tracking**: Advanced vehicle tracking using ByteTrack algorithm for consistent object identification
- **Real-time Processing**: Efficient processing with GPU acceleration support
- **WebSocket Support**: Live tracking capabilities via WebSocket connection
- **Modern UI**: Clean, responsive interface built with React and Shadcn UI components
- **Download Support**: Download processed videos with annotations
- **CORS Enabled**: Full cross-origin support for web applications

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance async web framework
- **YOLOv8**: State-of-the-art object detection model
- **OpenCV**: Computer vision library for image/video processing
- **Supervision**: Tracking and annotation utilities
- **Uvicorn**: ASGI server for production deployment
- **Pillow**: Image processing library
- **NumPy**: Numerical computing

### Frontend
- **React 18**: Modern JavaScript library with hooks
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and development server
- **Shadcn UI**: Beautiful, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **React Query**: Data fetching and state management

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- pip (Python package manager)
- npm or yarn (Node package manager)

## 🚀 Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. The YOLOv8 model (`yolov8n.pt`) is included in the repository. If you need a different model, download it from Ultralytics.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🎯 Usage

### Running the Application

1. **Start the Backend**:
   ```bash
   cd backend
   python app.py
   ```
   The API will be available at `http://localhost:8001`

2. **Start the Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### Using the Application

1. **Upload Files**: Use the file upload interface to select images or videos
2. **Process Images**: Click "Process Image" to detect vehicles in uploaded images
3. **Process Videos**:
   - "Detect in Video": Detect vehicles without tracking
   - "Track in Video": Detect and track vehicles across frames
4. **View Results**: See detections with bounding boxes, confidence scores, and statistics
5. **Download Videos**: Download processed videos with annotations

## 📡 API Endpoints

### Core Endpoints

- `GET /` - Health check and API information
- `GET /health` - Detailed health status
- `POST /api/process-image` - Process uploaded image for vehicle detection
- `POST /api/process-video` - Process video for vehicle detection
- `POST /api/process-video-tracking` - Process video with tracking
- `GET /api/download-video/{filename}` - Download processed video
- `WebSocket /ws/live-tracking` - Real-time tracking connection

### Request/Response Examples

#### Process Image
```json
POST /api/process-image
Content-Type: multipart/form-data

{
  "file": "<image_file>"
}
```

Response:
```json
{
  "success": true,
  "detections": [
    {
      "bbox": [x1, y1, x2, y2],
      "confidence": 0.95,
      "class_name": "car",
      "class_id": 2,
      "tracker_id": null
    }
  ],
  "processed_image": "<base64_encoded_image>"
}
```

## 🏗️ Project Structure

```
autonomous-driving_yolo8/
├── backend/
│   ├── app.py                    # Main FastAPI application
│   ├── inference_tracking.py     # Core processing logic
│   ├── requirements.txt          # Python dependencies
│   ├── yolov8n.pt               # YOLOv8 model weights
│   ├── static/                  # Processed video storage
│   └── models/                  # Additional models directory
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── lib/                # Utilities and API functions
│   │   └── hooks/              # Custom React hooks
│   ├── package.json            # Node dependencies
│   └── vite.config.js          # Vite configuration
└── README.md                   # This file
```

## 🔧 Configuration

### Backend Configuration

- **Port**: Default 8001 (configurable in `app.py`)
- **Model**: yolov8n.pt (lightweight model, can be changed to yolov8l.pt for better accuracy)
- **Static Directory**: `./static` for storing processed videos

### Frontend Configuration

- **API Base URL**: `http://localhost:8001` (configured in `src/lib/api.ts`)
- **Development Port**: 5173 (Vite default)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

