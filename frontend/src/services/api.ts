import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    
    if (axiosError.response) {
      const message = axiosError.response.data?.message || axiosError.response.data?.error;
      if (message) return message;
      
      switch (axiosError.response.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'Unauthorized. Please log in.';
        case 403:
          return 'Access forbidden.';
        case 404:
          return 'Resource not found.';
        case 409:
          return 'Conflict. This resource already exists.';
        case 422:
          return 'Validation error. Please check your input.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service unavailable. Please try again later.';
        default:
          return `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
      }
    } else if (axiosError.request) {
      return 'Network error. Please check your internet connection and try again.';
    } else {
      return axiosError.message || 'An unexpected error occurred.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred. Please try again.';
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const initializeDatabase = async () => {
  const response = await api.post('/init');
  return response.data;
};

export const getProducts = async (params?: { category?: string; featured?: boolean; search?: string }) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProduct = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

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

