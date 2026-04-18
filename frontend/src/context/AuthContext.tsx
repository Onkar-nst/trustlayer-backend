import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

interface User {
  id: string;
  email: string;
  role: string;
  profile?: {
    displayName: string;
    avatarUrl?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMe = async () => {
      try {
        const res = await apiClient.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkMe();
  }, []);

  const login = async (data: any) => {
    const res = await apiClient.post('/auth/login', data);
    setUser(res.data.user);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
  };

  const register = async (data: any) => {
    const res = await apiClient.post('/auth/register', data);
    setUser(res.data.user);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
  };

  const logout = async () => {
    await apiClient.post('/auth/logout');
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
