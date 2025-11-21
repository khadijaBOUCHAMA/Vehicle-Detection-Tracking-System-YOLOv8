const API_BASE_URL = 'http://localhost:8001/api';

export interface ProcessImageResponse {
  success: boolean;
  processed_image: string;
  detections: Array<{
    class_name: string;
    confidence: number;
    bbox: number[];
    tracker_id?: number;
  }>;
}

export interface ProcessVideoResponse {
  success: boolean;
  preview_image: string;
  processed_video: string;
  total_vehicles: number;
  final_counts: Record<string, number>;
}

export const processImage = async (file: File): Promise<ProcessImageResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/process-image`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to process image');
  }
  
  return response.json();
};

export const processVideoDetection = async (file: File): Promise<ProcessVideoResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/process-video`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to process video');
  }
  
  return response.json();
};

export const processVideoTracking = async (file: File): Promise<ProcessVideoResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/process-video-tracking`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to process video');
  }
  
  return response.json();
};

export const downloadVideo = async (filename: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/download-video/${filename}`);
  
  if (!response.ok) {
    throw new Error('Failed to download video');
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
