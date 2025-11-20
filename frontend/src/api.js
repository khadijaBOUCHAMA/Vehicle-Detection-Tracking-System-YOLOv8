import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const processImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/process-image', formData);
  return response.data;
};

export const processVideoTracking = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/process-video-tracking', formData);
  return response.data;
};

export const downloadVideo = async (filename) => {
  const response = await api.get(`/download-video/${filename}`, {
    responseType: 'blob'
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};