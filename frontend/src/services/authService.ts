import api from '../utils/api';
import { toast } from 'react-toastify';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  username: string;
  password: string;
}

// Standalone login function for public pages
export const loginUser = async (userData: LoginData): Promise<boolean> => {
  try {
    const response = await api.post('/api/auth/login', userData);
    
    if (response.data.success) {
      toast.success('Login successful! Redirecting...');
      return true;
    } else {
      toast.error(response.data.message || 'Login failed');
      return false;
    }
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
    toast.error(message);
    return false;
  }
};

// Standalone signup function for public pages
export const signupUser = async (userData: SignupData): Promise<boolean> => {
  try {
    const response = await api.post('/api/users/', userData);
    
    if (response.data.success) {
      toast.success('Account created successfully! Please verify your email.');
      return true;
    } else {
      toast.error(response.data.message || 'Signup failed');
      return false;
    }
  } catch (error: unknown) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Signup failed';
    toast.error(message);
    return false;
  }
};
