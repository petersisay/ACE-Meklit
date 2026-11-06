import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT token from localStorage to every authenticated request
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('aceMeklitUser');
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      console.error('Failed to parse stored user token', e);
    }
  }
  return config;
});

export const authApi = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (userData) => API.put('/auth/profile', userData),
  getUsers: () => API.get('/auth/users'),
};

export const productsApi = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  getCategories: () => API.get('/products/categories/list'),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
};

export const ordersApi = {
  create: (orderData) => API.post('/orders', orderData),
  getById: (id) => API.get(`/orders/${id}`),
  getMyOrders: () => API.get('/orders/myorders'),
  getAll: () => API.get('/orders'),
  pay: (id, paymentResult) => API.put(`/orders/${id}/pay`, paymentResult),
  initializeChapa: (id) => API.post(`/orders/${id}/chapa/initialize`),
  verifyChapa: (tx_ref, params) => API.get(`/orders/chapa/verify/${tx_ref}`, { params }),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
};

export const mediaApi = {
  getAll: (params) => API.get('/media', { params }),
  getById: (id) => API.get(`/media/${id}`),
  create: (data) => API.post('/media', data),
  update: (id, data) => API.put(`/media/${id}`, data),
  delete: (id) => API.delete(`/media/${id}`),
};

export const contactApi = {
  submit: (messageData) => API.post('/contact', messageData),
  sendMessage: (messageData) => API.post('/contact', messageData),
  getAll: () => API.get('/contact'),
  updateStatus: (id, status) => API.put(`/contact/${id}`, { status }),
  delete: (id) => API.delete(`/contact/${id}`),
};

export default API;
