/**
 * Order Management Service
 * 
 * Re-exports order-related functions from the centralized API service
 * This file exists for backward compatibility and convenience
 */

export { 
  createOrder, 
  getOrders, 
  getOrderById, 
  confirmDelivery 
} from './api-service';

export type { 
  CreateOrderData, 
  OrderListParams, 
  OrderResponse,
  PaginatedResponse
} from '@/lib/types/api-types';
