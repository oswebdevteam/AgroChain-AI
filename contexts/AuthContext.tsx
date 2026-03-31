"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setToken, removeToken, getToken } from '@/lib/auth';
import { login as loginService, register as registerService, getProfile } from '@/lib/services/auth-service';
import type { Profile, UserRole } from '@/types';
import type { LoginCredentials, RegisterData } from '@/lib/types/api-types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (error: any) {
      // Handle 401 errors (token expired/invalid)
      if (error.response?.status === 401) {
        removeToken();
        setUser(null);
        
        // Preserve return URL for redirect after login
        if (typeof window !== 'undefined') {
          const returnUrl = window.location.pathname + window.location.search;
          if (returnUrl !== '/login' && returnUrl !== '/register') {
            sessionStorage.setItem('returnUrl', returnUrl);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const authResponse = await loginService(credentials);
      setToken(authResponse.accessToken);
      setUser(authResponse.user);
      toast.success('Login successful');
      
      // Check for return URL
      const returnUrl = typeof window !== 'undefined' 
        ? sessionStorage.getItem('returnUrl') 
        : null;
      
      if (returnUrl) {
        sessionStorage.removeItem('returnUrl');
        router.push(returnUrl);
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (formData: RegisterData) => {
    try {
      const authResponse = await registerService(formData);
      
      // Auto-login after successful registration
      setToken(authResponse.accessToken);
      setUser(authResponse.user);
      toast.success('Registration successful. Welcome!');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    router.push('/');
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}