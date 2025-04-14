import axios, { InternalAxiosRequestConfig } from 'axios';

// Use a direct string for the API URL to avoid process.env issues
const API_URL = 'http://localhost:5000/api';

// Type definitions
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface Destination {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  country: string;
  rating: number;
  featured: boolean;
  category: 'flight' | 'hotel' | 'tour';
}

interface Booking {
  _id: string;
  user: string;
  destination: string | Destination;
  travelDate: string;
  numberOfTravelers: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  departureLocation: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const authService = {
  register: async (userData: RegisterData): Promise<User> => {
    const response = await api.post<User>('/users/register', userData);
    return response.data;
  },
  
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post<User>('/users/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) return JSON.parse(userStr);
    }
    return null;
  },
  
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
};

// Destination Services
export const destinationService = {
  getAll: async (params?: { category?: string; featured?: boolean; limit?: number }): Promise<Destination[]> => {
    const response = await api.get<Destination[]>('/destinations', { params });
    return response.data;
  },
  
  getById: async (id: string): Promise<Destination> => {
    const response = await api.get<Destination>(`/destinations/${id}`);
    return response.data;
  },
  
  create: async (destinationData: Partial<Destination>): Promise<Destination> => {
    const response = await api.post<Destination>('/destinations', destinationData);
    return response.data;
  },
  
  update: async (id: string, destinationData: Partial<Destination>): Promise<Destination> => {
    const response = await api.put<Destination>(`/destinations/${id}`, destinationData);
    return response.data;
  },
  
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/destinations/${id}`);
    return response.data;
  },
};

// Booking Services
export const bookingService = {
  getUserBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },
  
  getBooking: async (id: string): Promise<Booking> => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },
  
  createBooking: async (bookingData: {
    destinationId: string;
    travelDate: string;
    numberOfTravelers: number;
    departureLocation: string;
    specialRequests?: string;
  }): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', bookingData);
    return response.data;
  },
  
  updateBookingStatus: async (id: string, status: string): Promise<Booking> => {
    const response = await api.put<Booking>(`/bookings/${id}/status`, { status });
    return response.data;
  },
  
  cancelBooking: async (id: string): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(`/bookings/${id}/cancel`);
    return response.data;
  },
};

// Admin Services
export const adminService = {
  // Dashboard Analytics
  getAnalytics: async (): Promise<any> => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
  
  // User Management
  getAllUsers: async (): Promise<any[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  createUser: async (userData: any): Promise<any> => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },
  
  updateUser: async (userId: string, userData: any): Promise<any> => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },
  
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },
  
  // Booking Management
  getAllBookings: async (): Promise<any[]> => {
    const response = await api.get('/admin/bookings');
    return response.data;
  },
  
  updateBooking: async (bookingId: string, bookingData: any): Promise<any> => {
    const response = await api.put(`/admin/bookings/${bookingId}`, bookingData);
    return response.data;
  },
  
  deleteBooking: async (bookingId: string): Promise<void> => {
    await api.delete(`/admin/bookings/${bookingId}`);
  },
  
  // Destination Management
  getAllDestinations: async (): Promise<Destination[]> => {
    const response = await api.get('/admin/destinations');
    return response.data;
  },
  
  getDestination: async (id: string): Promise<Destination> => {
    const response = await api.get(`/admin/destinations/${id}`);
    return response.data;
  },
  
  createDestination: async (destinationData: FormData): Promise<Destination> => {
    const response = await api.post('/admin/destinations', destinationData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  updateDestination: async (id: string, destinationData: FormData): Promise<Destination> => {
    const response = await api.put(`/admin/destinations/${id}`, destinationData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  deleteDestination: async (id: string): Promise<void> => {
    await api.delete(`/admin/destinations/${id}`);
  },
  
  // System Settings
  getSystemSettings: async (): Promise<any> => {
    const response = await api.get('/admin/settings');
    return response.data;
  },
  
  updateSystemSettings: async (settingsData: any): Promise<any> => {
    const response = await api.put('/admin/settings', settingsData);
    return response.data;
  }
};

// Payment Services
export const paymentService = {
  initiateSTKPush: async (paymentData: {
    phoneNumber: string;
    amount: number;
    bookingRef: string;
  }): Promise<any> => {
    const response = await api.post('/payments/mpesa/stkpush', paymentData);
    return response.data;
  },
  
  checkTransactionStatus: async (checkoutRequestID: string): Promise<any> => {
    const response = await api.get(`/payments/mpesa/status/${checkoutRequestID}`);
    return response.data;
  }
};

export default api; 