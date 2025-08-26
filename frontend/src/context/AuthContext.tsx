import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import axios from 'axios';
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
  const [isLoading, setIsLoading] = useState<boolean>(true); // Corrected spelling
  const navigate = useNavigate();

  // Set default Axios headers for Authorization
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserData(token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsLoading(false);
    }
  }, [token]);

  const fetchUserData = async (currentToken: string) => {
    try {
      const decodedToken: any = decodeToken(currentToken);
      if (decodedToken && decodedToken.id) {
        setUser({
          _id: decodedToken.id,
          name: 'Authenticated User', // Placeholder, ideally fetch from backend
          email: 'authenticated@example.com', // Placeholder
          role: decodedToken.role || 'user', // Use role from token, default to 'user'
        });
        setIsLoading(false);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    }
  };

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


  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, _id, name, email: userEmail, role } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      setUser({ _id, name, email: userEmail, role });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      const { token, _id, name: userName, email: userEmail, role: userRole } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      setUser({ _id, name: userName, email: userEmail, role: userRole });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    const checkToken = () => {
      if (token) {
        fetchUserData(token);
      } else {
        setIsLoading(false);
      }
    };
    checkToken();
  }, [token]);


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