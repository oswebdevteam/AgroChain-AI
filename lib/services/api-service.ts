/**
 * Centralized API Service Module
 * 
 * This module provides a consistent interface for all backend API interactions.
 * All service functions follow these patterns:
 * - Use the axios instance from lib/api.ts
 * - Return typed responses using interfaces from lib/types/api-types.ts
 * - Handle errors consistently
 * - Include JSDoc comments for documentation
 */

import api from '@/lib/api';
import {
  ApiResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  CreateOrderData,
  OrderListParams,
  OrderResponse,
  PaginatedResponse,
  InitiatePaymentData,
  PaymentInitiationResponse,
  PaymentVerificationResponse,
  EscrowResponse,
  ReleaseEscrowData,
  EscrowReleaseResponse,
  BlockchainProofResponse,
  FinancialIdentityResponse,
  TradeCorridorParams,
  TradeCorridorResponse,
  FxRateParams,
  FxRateResponse,
} from '@/lib/types/api-types';
import { ProduceOrder, Profile } from '@/types';

// ============================================================================
// Authentication Services
// ============================================================================

/**
 * Login user with email and password
 * 
 * @param credentials - User login credentials
 * @returns Authentication response with access token and user profile
 * @throws Error on authentication failure
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await api.post('/auth/login', credentials);
  return data.data;
}

/**
 * Register a new user account
 * 
 * @param userData - User registration data
 * @returns Authentication response with access token and user profile
 * @throws Error on registration failure or validation errors
 */
export async function register(userData: RegisterData): Promise<AuthResponse> {
  const { data } = await api.post('/auth/register', userData);
  return data.data;
}

/**
 * Get current user profile
 * 
 * @returns User profile data
 * @throws Error if not authenticated
 */
export async function getProfile(): Promise<Profile> {
  const { data } = await api.get('/auth/profile');
  return data.data;
}

/**
 * Logout current user
 * Clears authentication tokens and redirects to login
 */
export async function logout(): Promise<void> {
  // Token clearing is handled by auth.ts
  // This function exists for consistency and future server-side logout logic
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

// ============================================================================
// Order Management Services
// ============================================================================

/**
 * Create a new produce order
 * 
 * @param orderData - Order creation data
 * @returns Created order with PENDING status
 * @throws Error on validation failure or if seller not found
 */
export async function createOrder(orderData: CreateOrderData): Promise<ProduceOrder> {
  const { data } = await api.post('/orders', orderData);
  return data.data;
}

/**
 * Get paginated list of orders with optional filters
 * 
 * @param params - Pagination and filter parameters
 * @returns Paginated list of orders
 */
export async function getOrders(params?: OrderListParams): Promise<PaginatedResponse<OrderResponse>> {
  const { data } = await api.get('/orders', { params });
  return data.data;
}

/**
 * Get order details by ID
 * 
 * @param orderId - Order UUID
 * @returns Order details with seller and buyer information
 * @throws Error if order not found or unauthorized
 */
export async function getOrderById(orderId: string): Promise<OrderResponse> {
  const { data } = await api.get(`/orders/${orderId}`);
  return data.data;
}

/**
 * Confirm delivery of an order
 * Updates order status to COMPLETED and triggers escrow release
 * 
 * @param orderId - Order UUID
 * @returns Updated order with COMPLETED status
 * @throws Error if order not in DELIVERED status or not authorized
 */
export async function confirmDelivery(orderId: string): Promise<ProduceOrder> {
  const { data } = await api.post(`/orders/${orderId}/confirm-delivery`);
  return data.data;
}

// ============================================================================
// Payment Services
// ============================================================================

/**
 * Initiate payment for an order via Interswitch
 * 
 * @param paymentData - Payment initiation data
 * @returns Redirect URL and transaction reference
 * @throws Error if order already paid or amount mismatch
 */
export async function initiatePayment(paymentData: InitiatePaymentData): Promise<PaymentInitiationResponse> {
  const { data } = await api.post('/payments/initiate', paymentData);
  return data.data;
}

/**
 * Verify payment with Interswitch using payment reference
 * Implements retry logic with exponential backoff for network errors
 * 
 * @param ref - Payment reference from Interswitch redirect
 * @returns Payment verification response
 * @throws Error on non-retryable errors or after max retries
 */
export async function verifyPayment(ref: string): Promise<PaymentVerificationResponse> {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount <= maxRetries) {
    try {
      const { data } = await api.get(`/payments/verify/${ref}`);
      return data.data as PaymentVerificationResponse;
    } catch (error: any) {
      // Check if it's a network error that should be retried
      const isNetworkError = error.code === 'ERR_NETWORK' || 
                            error.code === 'ECONNABORTED' ||
                            !error.response;

      if (isNetworkError && retryCount < maxRetries) {
        retryCount++;
        // Exponential backoff: 1s, 2s, 4s
        const backoffDelay = Math.pow(2, retryCount - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }

      // Non-retryable error or max retries exceeded
      throw error;
    }
  }

  // Should never reach here, but TypeScript needs it
  throw new Error('Payment verification failed after maximum retries');
}

// ============================================================================
// Escrow Management Services
// ============================================================================

/**
 * Get escrow details for an order
 * 
 * @param orderId - Order UUID
 * @returns Escrow details including status and blockchain transaction hash
 * @throws Error if escrow not found
 */
export async function getEscrowByOrderId(orderId: string): Promise<EscrowResponse> {
  const { data } = await api.get(`/escrow/${orderId}`);
  return data.data;
}

/**
 * Release escrow funds to seller (Admin only)
 * 
 * @param orderId - Order UUID
 * @param releaseData - Admin ID and optional notes
 * @returns Updated escrow with RELEASED status and blockchain transaction hash
 * @throws Error if not admin, escrow already released, or order not delivered
 */
export async function releaseEscrow(
  orderId: string, 
  releaseData: ReleaseEscrowData
): Promise<EscrowReleaseResponse> {
  const { data } = await api.post(`/escrow/${orderId}/release`, releaseData);
  return data.data;
}

// ============================================================================
// Blockchain Verification Services
// ============================================================================

/**
 * Get blockchain proof for an order
 * Returns all blockchain events associated with the order
 * 
 * @param orderId - Order UUID
 * @returns Blockchain events with transaction hashes and timestamps
 * @throws Error if order not found
 */
export async function getBlockchainProof(orderId: string): Promise<BlockchainProofResponse> {
  const { data } = await api.get(`/blockchain/proof/${orderId}`);
  return data.data;
}

// ============================================================================
// Financial Identity Services
// ============================================================================

/**
 * Get financial identity and credit score for a user
 * 
 * @param userId - User UUID
 * @returns Financial identity with credit score, risk indicators, and recommendations
 * @throws Error if unauthorized (can only view own identity unless admin)
 */
export async function getFinancialIdentity(userId: string): Promise<FinancialIdentityResponse> {
  const { data } = await api.get(`/users/${userId}/financial-identity`);
  return data.data;
}

/**
 * Trigger AI re-analysis of financial identity (Admin only)
 * 
 * @param userId - User UUID
 * @returns Success message
 * @throws Error if not admin or user not found
 */
export async function analyzeFinancialIdentity(userId: string): Promise<void> {
  await api.post(`/users/${userId}/financial-identity/analyze`);
}

// ============================================================================
// Analytics Services
// ============================================================================

/**
 * Get trade corridor analytics
 * 
 * @param params - Optional date range and produce type filters
 * @returns Trade corridor statistics
 */
export async function getTradeCorridors(params?: TradeCorridorParams): Promise<TradeCorridorResponse> {
  const { data } = await api.get('/analytics/trade-corridors', { params });
  return data.data;
}

/**
 * Get foreign exchange rate conversion
 * 
 * @param params - Source currency, target currency, and amount
 * @returns Exchange rate and converted amount
 */
export async function getFxRate(params: FxRateParams): Promise<FxRateResponse> {
  const { data } = await api.get('/analytics/fx-rate', { params });
  return data.data;
}

// ============================================================================
// Export all services
// ============================================================================

export default {
  // Auth
  login,
  register,
  getProfile,
  logout,
  
  // Orders
  createOrder,
  getOrders,
  getOrderById,
  confirmDelivery,
  
  // Payments
  initiatePayment,
  verifyPayment,
  
  // Escrow
  getEscrowByOrderId,
  releaseEscrow,
  
  // Blockchain
  getBlockchainProof,
  
  // Financial Identity
  getFinancialIdentity,
  analyzeFinancialIdentity,
  
  // Analytics
  getTradeCorridors,
  getFxRate,
};
