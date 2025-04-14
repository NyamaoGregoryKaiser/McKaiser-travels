import { create, StateCreator } from 'zustand';
import { authService } from './api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const createAuthStore: StateCreator<AuthState> = (set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const userData = await authService.login({ email, password });
      set({ 
        user: userData, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register({ name, email, password });
      const userData = await authService.login({ email, password });
      set({ 
        user: userData, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
    }
  },
  
  logout: () => {
    authService.logout();
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  },
  
  clearError: () => set({ error: null }),
});

export const useAuthStore = create<AuthState>(createAuthStore);

// Initialize the auth state from localStorage
if (typeof window !== 'undefined') {
  const user = authService.getCurrentUser();
  if (user) {
    useAuthStore.setState({ 
      user, 
      isAuthenticated: true 
    });
  }
} 