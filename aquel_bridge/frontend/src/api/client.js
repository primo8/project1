import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ttsApi = {
  speak: (text, voice) => client.post('/api/tts/speak', { text, voice }),
  getVoices: () => client.get('/api/tts/voices'),
};

export const symbolsApi = {
  getSymbols: (category) => client.get('/api/symbols/', { params: { category } }),
  getCategories: () => client.get('/api/symbols/categories'),
};

export const visionApi = {
  recognize: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post('/api/vision/recognize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  train: (name, file) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    return client.post('/api/vision/train', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  recognizeSequence: (files) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
    });
    return client.post('/api/vision/recognize-sequence', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default client;
