import { useContext } from 'react';
import { createContext } from 'react';

interface User {
  _id: string;
  email: string;
  username: string;
  isVerified: boolean;
}

interface SignupData {
  email: string;
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (userData: SignupData) => Promise<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
