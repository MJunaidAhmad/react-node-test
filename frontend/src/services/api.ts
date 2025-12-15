import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle errors consistently
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors or API errors
    if (error.response) {
      // Server responded with error status
      return Promise.reject(error);
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

// Initialize database
export const initializeDatabase = async () => {
  const response = await api.post('/init');
  return response.data;
};

// Products API
export const getProducts = async (params?: { category?: string; featured?: boolean; search?: string }) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProduct = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Users API
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: { email: string; name: string; role?: string }) => {
  const response = await api.post('/users', userData);
  return response.data;
};

// Orders API
export const getOrders = async (params?: { userId?: string; status?: string }) => {
  const response = await api.get('/orders', { params });
  return response.data;
};

export const getOrder = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (orderData: {
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data;
};

