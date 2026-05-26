import axios from 'axios';

// Create an Axios instance
export const api = axios.create({
  baseURL: '/api', // Proxies to Node.js backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanUrl = async (url: string) => {
  const response = await api.post('/scans/url', { url });
  return response.data;
};

export const scanEmail = async (emailText: string) => {
  const response = await api.post('/scans/email', { email_text: emailText });
  return response.data;
};

export const scanScreenshot = async (imageFile: File) => {
  // Use FormData for file upload
  const formData = new FormData();
  formData.append('screenshot', imageFile);

  const response = await api.post('/scans/screenshot', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const chatWithSecurityAI = async (message: string, history: any[] = []) => {
  const response = await api.post('/chat', { message, history });
  return response.data;
};

export const getScanHistory = async () => {
  const response = await api.get('/scans/history');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/scans/stats');
  return response.data;
};
