/**
 * Authentication Service
 * 
 * Re-exports authentication-related functions from the centralized API service
 * This file exists for backward compatibility and convenience
 */

export { login, register, getProfile, logout } from './api-service';
export type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse 
} from '@/lib/types/api-types';
