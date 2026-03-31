import { verifyPayment } from './payment-service';
import api from '../api';

// Mock the api module
jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('verifyPayment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return payment verification response on success', async () => {
    const mockResponse = {
      data: {
        data: {
          status: 'SUCCESS',
          orderId: '123e4567-e89b-12d3-a456-426614174000',
          transactionRef: 'TXN123456',
          amount: 50000,
          message: 'Payment verified successfully'
        }
      }
    };

    mockedApi.get.mockResolvedValueOnce(mockResponse);

    const result = await verifyPayment('PAYMENT_REF_123');

    expect(result).toEqual(mockResponse.data.data);
    expect(mockedApi.get).toHaveBeenCalledWith('/v1/payments/verify/PAYMENT_REF_123');
    expect(mockedApi.get).toHaveBeenCalledTimes(1);
  });

  it('should return FAILED status when payment fails', async () => {
    const mockResponse = {
      data: {
        data: {
          status: 'FAILED',
          message: 'Payment was declined'
        }
      }
    };

    mockedApi.get.mockResolvedValueOnce(mockResponse);

    const result = await verifyPayment('PAYMENT_REF_FAILED');

    expect(result.status).toBe('FAILED');
    expect(result.message).toBe('Payment was declined');
  });

  it('should return PENDING status when payment is processing', async () => {
    const mockResponse = {
      data: {
        data: {
          status: 'PENDING',
          message: 'Payment is being processed'
        }
      }
    };

    mockedApi.get.mockResolvedValueOnce(mockResponse);

    const result = await verifyPayment('PAYMENT_REF_PENDING');

    expect(result.status).toBe('PENDING');
    expect(result.message).toBe('Payment is being processed');
  });

  it('should retry up to 3 times on network errors with exponential backoff', async () => {
    const networkError = {
      code: 'ERR_NETWORK',
      message: 'Network Error'
    };

    mockedApi.get
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError)
      .mockResolvedValueOnce({
        data: {
          data: {
            status: 'SUCCESS',
            orderId: '123e4567-e89b-12d3-a456-426614174000',
            message: 'Payment verified successfully'
          }
        }
      });

    const verifyPromise = verifyPayment('PAYMENT_REF_RETRY');

    // Fast-forward through the backoff delays
    // First retry: 1 second (2^0 * 1000)
    await jest.advanceTimersByTimeAsync(1000);
    // Second retry: 2 seconds (2^1 * 1000)
    await jest.advanceTimersByTimeAsync(2000);

    const result = await verifyPromise;

    expect(result.status).toBe('SUCCESS');
    expect(mockedApi.get).toHaveBeenCalledTimes(3);
  });

  it('should not retry on non-network errors', async () => {
    const serverError = {
      response: {
        status: 500,
        data: {
          message: 'Internal server error'
        }
      }
    };

    mockedApi.get.mockRejectedValueOnce(serverError);

    await expect(verifyPayment('PAYMENT_REF_500')).rejects.toEqual(serverError);
    expect(mockedApi.get).toHaveBeenCalledTimes(1);
  });

  it('should not retry on 404 errors', async () => {
    const notFoundError = {
      response: {
        status: 404,
        data: {
          message: 'Payment not found'
        }
      }
    };

    mockedApi.get.mockRejectedValueOnce(notFoundError);

    await expect(verifyPayment('INVALID_REF')).rejects.toEqual(notFoundError);
    expect(mockedApi.get).toHaveBeenCalledTimes(1);
  });

  it('should handle SUCCESSFUL status (alternative success status)', async () => {
    const mockResponse = {
      data: {
        data: {
          status: 'SUCCESSFUL',
          orderId: '123e4567-e89b-12d3-a456-426614174000',
          message: 'Payment successful'
        }
      }
    };

    mockedApi.get.mockResolvedValueOnce(mockResponse);

    const result = await verifyPayment('PAYMENT_REF_ALT');

    expect(result.status).toBe('SUCCESSFUL');
    expect(result.orderId).toBe('123e4567-e89b-12d3-a456-426614174000');
  });
});
