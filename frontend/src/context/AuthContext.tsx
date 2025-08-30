import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';




// Define the User type
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// Define the AuthContextType
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: React.Dispatch<React.SetStateAction<string | null>>; // Added setToken to context
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define AuthProviderProps
interface AuthProviderProps {
  children: ReactNode;
}



export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Helper function for logout (will be called by context and interceptor)
  const performLogout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    try {
      // Call backend to clear httpOnly refresh token cookie
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Error clearing refresh token on backend:', error);
    }
    navigate('/login');
  };

  // fetchUserData remains the same, but now it uses the new performLogout
  const fetchUserData = async (currentToken: string) => {
    try {
      const decodedToken: any = decodeToken(currentToken);
      if (decodedToken && decodedToken.id) {
        setUser({
          _id: decodedToken.id,
          name: 'Authenticated User', // Placeholder, ideally fetch from backend
          email: 'authenticated@example.com', // Placeholder
          role: decodedToken.role || 'user',
        });
        setIsLoading(false);
      } else {
        performLogout();
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      performLogout();
    }
  };

  // Set default Axios headers for Authorization using axiosInstance
  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserData(token);
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
      setUser(null);
      setIsLoading(false);
    }
  }, [token, fetchUserData]);

  const decodeToken = (jwtToken: string) => {
    try {
      const parts = jwtToken.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format: expected 3 parts.');
        return null;
      }
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };


  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token: newAccessToken, _id, name, email: userEmail, role } = response.data;
      setToken(newAccessToken);
      localStorage.setItem('token', newAccessToken);
      setUser({ _id, name, email: userEmail, role });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await axiosInstance.post('/auth/register', { name, email, password, role });
      const { token: newAccessToken, _id, name: userName, email: userEmail, role: userRole } = response.data;
      setToken(newAccessToken);
      localStorage.setItem('token', newAccessToken);
      setUser({ _id, name: userName, email: userEmail, role: userRole });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout: performLogout, isAuthenticated, isLoading, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};