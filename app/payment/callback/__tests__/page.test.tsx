import { render, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import PaymentCallbackPage from '../page';
import { verifyPayment } from '@/lib/services/payment-service';
import React from 'react';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/services/payment-service', () => ({
  verifyPayment: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockVerifyPayment = verifyPayment as jest.MockedFunction<typeof verifyPayment>;

describe('PaymentCallbackPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any);
  });

  it('renders loading state initially', async () => {
    mockVerifyPayment.mockImplementation(() => new Promise(() => {})); // Never resolves

    const searchParams = Promise.resolve({ ref: 'TEST123' });
    
    let container;
    await act(async () => {
      const result = render(<PaymentCallbackPage searchParams={searchParams} />);
      container = result.container;
    });

    await waitFor(() => {
      expect(container.textContent).toContain('Verifying payment');
    });
  });

  it('displays success state and redirects on successful verification', async () => {
    mockVerifyPayment.mockResolvedValue({
      status: 'SUCCESS',
      orderId: 'order-123',
      message: 'Payment successful',
    });

    const searchParams = Promise.resolve({ ref: 'TEST123' });
    
    let container;
    await act(async () => {
      const result = render(<PaymentCallbackPage searchParams={searchParams} />);
      container = result.container;
    });

    await waitFor(() => {
      expect(container.textContent).toContain('Payment Successful');
    }, { timeout: 3000 });

    expect(container.textContent).toContain('Payment successful');

    // Check auto-redirect after 3 seconds
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/orders/order-123');
    }, { timeout: 4000 });
  });

  it('displays failure state with error message', async () => {
    mockVerifyPayment.mockResolvedValue({
      status: 'FAILED',
      message: 'Payment was declined',
    });

    const searchParams = Promise.resolve({ ref: 'TEST123' });
    
    let container;
    await act(async () => {
      const result = render(<PaymentCallbackPage searchParams={searchParams} />);
      container = result.container;
    });

    await waitFor(() => {
      expect(container.textContent).toContain('Payment Failed');
    }, { timeout: 3000 });

    expect(container.textContent).toContain('Payment was declined');
  });

  it('displays pending state for processing payments', async () => {
    mockVerifyPayment.mockResolvedValue({
      status: 'PENDING',
      message: 'Payment is being processed',
    });

    const searchParams = Promise.resolve({ ref: 'TEST123' });
    
    let container;
    await act(async () => {
      const result = render(<PaymentCallbackPage searchParams={searchParams} />);
      container = result.container;
    });

    await waitFor(() => {
      expect(container.textContent).toContain('Payment Processing');
    }, { timeout: 3000 });

    expect(container.textContent).toContain('Payment is being processed');
  });

  it('handles missing ref parameter with error and redirect', async () => {
    const searchParams = Promise.resolve({});
    
    let container;
    await act(async () => {
      const result = render(<PaymentCallbackPage searchParams={searchParams} />);
      container = result.container;
    });

    await waitFor(() => {
      expect(container.textContent).toContain('Invalid Payment Link');
    }, { timeout: 3000 });

    expect(container.textContent).toContain('Missing payment reference');

    // Check redirect after 3 seconds
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/orders');
    }, { timeout: 4000 });
  });

  it('handles network errors gracefully', async () => {
    mockVerifyPayment.mockRejectedValue({
      code: 'ERR_NETWORK',
      message: 'Network error',
    });

    const searchParams = Promise.resolve({ ref: 'TEST123' });
    
    let container;
    await act(async () => {
      const result = render(<PaymentCallbackPage searchParams={searchParams} />);
      container = result.container;
    });

    await waitFor(() => {
      expect(container.textContent).toContain('Payment Failed');
    }, { timeout: 3000 });

    expect(container.textContent).toContain('Could not verify payment');
  });

  it('stores payment ref in localStorage', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    mockVerifyPayment.mockImplementation(() => new Promise(() => {}));

    const searchParams = Promise.resolve({ ref: 'TEST123' });
    
    await act(async () => {
      render(<PaymentCallbackPage searchParams={searchParams} />);
    });

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith('pending_payment_ref', 'TEST123');
    }, { timeout: 3000 });

    setItemSpy.mockRestore();
  });

  it('clears localStorage on successful payment', async () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    mockVerifyPayment.mockResolvedValue({
      status: 'SUCCESS',
      orderId: 'order-123',
    });

    const searchParams = Promise.resolve({ ref: 'TEST123' });
    
    await act(async () => {
      render(<PaymentCallbackPage searchParams={searchParams} />);
    });

    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith('pending_payment_ref');
    }, { timeout: 3000 });

    removeItemSpy.mockRestore();
  });
});
