import React, { createContext, useState, useEffect, useContext, type ReactNode, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export { axiosInstance }; // Export axiosInstance

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
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define AuthProviderProps
interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to set up Axios interceptors
const setupAxiosInterceptors = (setToken: React.Dispatch<React.SetStateAction<string | null>>, logout: () => void) => {
  let reqInterceptorId: number | null = null;
  let resInterceptorId: number | null = null;

  reqInterceptorId = axiosInstance.interceptors.request.use(
    config => {
      const currentToken = localStorage.getItem('token');
      if (currentToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  resInterceptorId = axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
      const prevRequest = error.config;
      if (error.response?.status === 401 && !prevRequest._retry) {
        prevRequest._retry = true;
        try {
          const refreshResponse = await axiosInstance.get('/auth/refresh');
          const newAccessToken = refreshResponse.data.token;

          setToken(newAccessToken);
          localStorage.setItem('token', newAccessToken);

          prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosInstance(prevRequest);
        } catch (refreshError: any) {
          console.error('Failed to refresh token or refresh token invalid:', refreshError);
          logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return () => {
    if (reqInterceptorId !== null) {
      axiosInstance.interceptors.request.eject(reqInterceptorId);
    }
    if (resInterceptorId !== null) {
      axiosInstance.interceptors.response.eject(resInterceptorId);
    }
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Improved JWT decode for client-side (still for display/convenience, not security-critical)
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

  // Ensure logout is stable, or it will cause infinite re-renders of the useEffect above
  // We'll wrap it in useCallback for this purpose.
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  }, [setToken, setUser, navigate]);

  // Memoize fetchUserData to prevent infinite re-renders
  const fetchUserData = useCallback(async (currentToken: string) => {
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
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    }
  }, [setUser, setIsLoading, logout, decodeToken]); // Dependencies for useCallback

  // Set up Axios interceptors once
  useEffect(() => {
    const cleanup = setupAxiosInterceptors(setToken, logout);
    return cleanup;
  }, [setToken, logout]);


  // Adjust login and register to use axiosInstance
  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password }); // Use axiosInstance
      const { token, _id, name, email: userEmail, role } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      setUser({ _id, name, email: userEmail, role });
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await axiosInstance.post('/auth/register', { name, email, password, role }); // Use axiosInstance
      const { token, _id, name: userName, email: userEmail, role: userRole } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      setUser({ _id, name: userName, email: userEmail, role: userRole });
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const isAuthenticated = !!user && !!token;

  // Initial token check on component mount
  useEffect(() => {
    const checkToken = () => {
      if (token) {
        fetchUserData(token);
      } else {
        setIsLoading(false);
      }
    };
    checkToken();
  }, [token, fetchUserData]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated, isLoading }}>
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