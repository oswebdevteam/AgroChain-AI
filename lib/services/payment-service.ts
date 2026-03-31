import api from '@/lib/api';

export interface PaymentVerificationResponse {
  status: 'SUCCESS' | 'SUCCESSFUL' | 'FAILED' | 'PENDING';
  orderId?: string;
  transactionRef?: string;
  amount?: number;
  message?: string;
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
      const { data } = await api.get(`/v1/payments/verify/${ref}`);
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
