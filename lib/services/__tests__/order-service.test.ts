/**
 * Unit Tests for Order Management Services
 */

import { createOrder, getOrders, getOrderById, confirmDelivery } from '../order-service';
import api from '@/lib/api';
import { OrderStatus } from '@/types';

// Mock the api module
jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('Order Service Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create order with valid data', async () => {
      const orderData = {
        seller_id: '123e4567-e89b-12d3-a456-426614174000',
        produce_type: 'Tomatoes',
        quantity: 100,
        unit: 'kg',
        unit_price: 50.00,
        delivery_address: '123 Farm Road, Lagos, Nigeria',
      };

      const mockResponse = {
        data: {
          data: {
            id: '987e6543-e21b-12d3-a456-426614174000',
            ...orderData,
            total_amount: 5000.00,
            status: 'PENDING',
            buyer_id: '456e7890-e12b-34d5-a678-901234567890',
            currency: 'NGN',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockedApi.post.mockResolvedValueOnce(mockResponse);

      const result = await createOrder(orderData);

      expect(result).toEqual(mockResponse.data.data);
      expect(mockedApi.post).toHaveBeenCalledWith('/v1/orders', orderData);
      expect(result.status).toBe('PENDING');
      expect(result.total_amount).toBe(5000.00);
    });

    it('should handle validation errors', async () => {
      const invalidOrderData = {
        seller_id: 'invalid-uuid',
        produce_type: '',
        quantity: -1,
        unit: 'kg',
        unit_price: 0,
        delivery_address: '',
      };

      mockedApi.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            errors: {
              seller_id: ['Invalid UUID format'],
              produce_type: ['Produce type is required'],
              quantity: ['Quantity must be positive'],
            },
          },
        },
      });

      await expect(createOrder(invalidOrderData as any)).rejects.toMatchObject({
        response: {
          status: 400,
        },
      });
    });
  });

  describe('getOrders', () => {
    it('should retrieve paginated orders list', async () => {
      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: '123e4567-e89b-12d3-a456-426614174000',
                produce_type: 'Tomatoes',
                quantity: 100,
                status: 'PENDING',
              },
              {
                id: '987e6543-e21b-12d3-a456-426614174000',
                produce_type: 'Onions',
                quantity: 50,
                status: 'PAID',
              },
            ],
            pagination: {
              page: 1,
              limit: 20,
              total: 2,
              totalPages: 1,
            },
          },
        },
      };

      mockedApi.get.mockResolvedValueOnce(mockResponse);

      const result = await getOrders({ page: 1, limit: 20 });

      expect(result).toEqual(mockResponse.data.data);
      expect(mockedApi.get).toHaveBeenCalledWith('/v1/orders', {
        params: { page: 1, limit: 20 },
      });
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should filter orders by status', async () => {
      const mockResponse = {
        data: {
          data: {
            data: [
              {
                id: '123e4567-e89b-12d3-a456-426614174000',
                status: 'PAID',
              },
            ],
            pagination: {
              page: 1,
              limit: 20,
              total: 1,
              totalPages: 1,
            },
          },
        },
      };

      mockedApi.get.mockResolvedValueOnce(mockResponse);

      const result = await getOrders({ status: OrderStatus.PAID });

      expect(mockedApi.get).toHaveBeenCalledWith('/v1/orders', {
        params: { status: OrderStatus.PAID },
      });
      expect(result.data[0].status).toBe('PAID');
    });
  });

  describe('getOrderById', () => {
    it('should retrieve order details by ID', async () => {
      const orderId = '123e4567-e89b-12d3-a456-426614174000';
      const mockResponse = {
        data: {
          data: {
            id: orderId,
            produce_type: 'Tomatoes',
            quantity: 100,
            status: 'PAID',
            seller: {
              id: '456e7890-e12b-34d5-a678-901234567890',
              full_name: 'John Farmer',
            },
            buyer: {
              id: '789e0123-e45b-67d8-a901-234567890123',
              full_name: 'Jane Buyer',
            },
          },
        },
      };

      mockedApi.get.mockResolvedValueOnce(mockResponse);

      const result = await getOrderById(orderId);

      expect(result).toEqual(mockResponse.data.data);
      expect(mockedApi.get).toHaveBeenCalledWith(`/v1/orders/${orderId}`);
      expect(result.seller).toBeDefined();
      expect(result.buyer).toBeDefined();
    });

    it('should handle order not found', async () => {
      const orderId = '999e9999-e99b-99d9-a999-999999999999';

      mockedApi.get.mockRejectedValueOnce({
        response: {
          status: 404,
          data: {
            message: 'Order not found',
          },
        },
      });

      await expect(getOrderById(orderId)).rejects.toMatchObject({
        response: {
          status: 404,
        },
      });
    });
  });

  describe('confirmDelivery', () => {
    it('should confirm delivery and update order status', async () => {
      const orderId = '123e4567-e89b-12d3-a456-426614174000';
      const mockResponse = {
        data: {
          data: {
            id: orderId,
            status: 'COMPLETED',
            updated_at: '2024-01-02T00:00:00Z',
          },
        },
      };

      mockedApi.post.mockResolvedValueOnce(mockResponse);

      const result = await confirmDelivery(orderId);

      expect(result).toEqual(mockResponse.data.data);
      expect(mockedApi.post).toHaveBeenCalledWith(`/v1/orders/${orderId}/confirm-delivery`);
      expect(result.status).toBe('COMPLETED');
    });

    it('should handle invalid status transition', async () => {
      const orderId = '123e4567-e89b-12d3-a456-426614174000';

      mockedApi.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            message: 'Cannot confirm delivery for order in current status',
          },
        },
      });

      await expect(confirmDelivery(orderId)).rejects.toMatchObject({
        response: {
          status: 400,
        },
      });
    });
  });
});
