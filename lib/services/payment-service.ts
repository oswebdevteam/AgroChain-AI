/**
 * Payment Service
 * 
 * Re-exports payment-related functions from the centralized API service
 * with enhanced payment-specific error handling
 */

import { 
  verifyPayment as apiVerifyPayment, 
  initiatePayment as apiInitiatePayment 
} from './api-service';
import type { 
  PaymentVerificationResponse, 
  PaymentInitiationResponse,
  InitiatePaymentData 
} from '@/lib/types/api-types';
import toast from 'react-hot-toast';

export type { PaymentVerificationResponse, PaymentInitiationResponse } from '@/lib/types/api-types';

// ============================================================================
// Payment Service Functions with Enhanced Error Handling
// ============================================================================

/**
 * Initiates payment for an order with enhanced error handling
 * 
 * @param data - Payment initiation data
 * @returns Payment initiation response with redirect URL
 * @throws Error with specific messages for different failure scenarios
 */
export async function initiatePayment(data: InitiatePaymentData): Promise<PaymentInitiationResponse> {
  try {
    return await apiInitiatePayment(data);
  } catch (error: any) {
    // Handle payment-specific errors
    const errorMessage = error.response?.data?.message || error.message;
    
    if (errorMessage?.toLowerCase().includes('already paid')) {
      // Order already paid error
      if (typeof window !== 'undefined') {
        toast.error('This order has already been paid');
      }
      throw new Error('Order already paid');
    } else if (errorMessage?.toLowerCase().includes('amount') && errorMessage?.toLowerCase().includes('mismatch')) {
      // Amount mismatch error
      if (typeof window !== 'undefined') {
        toast.error('Payment amount does not match order total');
      }
      throw new Error('Amount mismatch');
    } else if (error.response?.status === 404) {
      // Order not found
      if (typeof window !== 'undefined') {
        toast.error('Order not found');
      }
      throw new Error('Order not found');
    } else {
      // Generic payment initiation failure
      if (typeof window !== 'undefined') {
        toast.error('Failed to initiate payment. Please try again.');
      }
      throw error;
    }
  }
}

/**
 * Verifies payment with enhanced error handling
 * 
 * @param ref - Payment reference from Interswitch
 * @returns Payment verification response
 * @throws Error with specific messages for different failure scenarios
 */
export async function verifyPayment(ref: string): Promise<PaymentVerificationResponse> {
  try {
    return await apiVerifyPayment(ref);
  } catch (error: any) {
    // Handle payment verification errors
    if (error.response?.status === 404) {
      // Payment not found - re-throw original error for proper handling
      if (typeof window !== 'undefined') {
        toast.error('Payment not found. Please check your payment reference.');
      }
      throw error;
    } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || !error.response) {
      // Network errors are already handled by retry logic in api-service
      // Just re-throw to let the retry mechanism handle it
      throw error;
    } else {
      // Other errors
      if (typeof window !== 'undefined') {
        toast.error('Failed to verify payment. Please try again.');
      }
      throw error;
    }
  }
}

// ============================================================================
// Payment Validation Helpers
// ============================================================================

/**
 * Validates payment reference format
 * Payment references must be alphanumeric strings between 10 and 50 characters
 * 
 * @param ref - Payment reference to validate
 * @returns true if valid, false otherwise
 */
export function validatePaymentReference(ref: string): boolean {
  if (!ref || typeof ref !== 'string') {
    return false;
  }
  
  // Alphanumeric, 10-50 characters
  const paymentRefRegex = /^[a-zA-Z0-9]{10,50}$/;
  return paymentRefRegex.test(ref);
}

/**
 * Stores order ID in sessionStorage before payment redirect
 * This allows retrieving the order ID after payment callback
 * 
 * @param orderId - Order UUID to store
 */
export function storeOrderIdForPayment(orderId: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('pendingPaymentOrderId', orderId);
  }
}

/**
 * Retrieves and clears stored order ID from sessionStorage
 * 
 * @returns Order ID if found, null otherwise
 */
export function retrieveStoredOrderId(): string | null {
  if (typeof window !== 'undefined') {
    const orderId = sessionStorage.getItem('pendingPaymentOrderId');
    if (orderId) {
      sessionStorage.removeItem('pendingPaymentOrderId');
    }
    return orderId;
  }
  return null;
}
