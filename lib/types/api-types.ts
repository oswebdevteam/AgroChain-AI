import { 
  UserRole, 
  OrderStatus, 
  EscrowStatus, 
  Currency, 
  FinancingEligibility,
  Profile,
  ProduceOrder,
  Escrow,
  FinancialIdentity,
  BlockchainProof,
  TradeCorridor
} from '@/types';

// Re-export types that are used in service modules
export type { BlockchainProof, TradeCorridor, Escrow, FinancialIdentity } from '@/types';

// ============================================================================
// Generic API Response Types
// ============================================================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: UserRole;
  full_name: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Profile;
}

// ============================================================================
// Order Types
// ============================================================================

export interface CreateOrderData {
  seller_id: string;
  produce_type: string;
  quantity: number;
  unit: string;
  unit_price: number;
  delivery_address: string;
  notes?: string;
}

export interface OrderListParams extends PaginationParams {
  status?: OrderStatus;
  seller_id?: string;
  buyer_id?: string;
  produce_type?: string;
  start_date?: string;
  end_date?: string;
}

export interface OrderResponse extends ProduceOrder {
  seller?: Profile;
  buyer?: Profile;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface InitiatePaymentData {
  orderId: string;
  amount: number;
  currency: Currency;
}

export interface PaymentInitiationResponse {
  redirectUrl: string;
  transactionRef: string;
}

export interface PaymentVerificationResponse {
  status: 'SUCCESS' | 'SUCCESSFUL' | 'FAILED' | 'PENDING';
  orderId?: string;
  transactionRef?: string;
  amount?: number;
  message?: string;
}

export interface PaymentTransaction {
  id: string;
  order_id: string;
  amount: number;
  currency: Currency;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  payment_reference: string;
  payment_method: 'INTERSWITCH';
  created_at: string;
  completed_at: string | null;
}

// ============================================================================
// Escrow Types
// ============================================================================

export interface EscrowResponse extends Escrow {
  order?: ProduceOrder;
}

export interface ReleaseEscrowData {
  admin_id: string;
  notes?: string;
}

export interface EscrowReleaseResponse {
  escrow: Escrow;
  blockchain_tx_hash: string;
}

// ============================================================================
// Blockchain Types
// ============================================================================

export interface BlockchainProofResponse {
  order_id: string;
  events: BlockchainProof[];
}

// ============================================================================
// Financial Identity Types
// ============================================================================

export interface FinancialIdentityResponse {
  identity: FinancialIdentity;
  recommendations: string[];
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface TradeCorridorParams {
  startDate?: string;
  endDate?: string;
  produceType?: string;
}

export interface FxRateParams {
  from: Currency;
  to: Currency;
  amount: number;
}

export interface FxRateResponse {
  from: Currency;
  to: Currency;
  rate: number;
  convertedAmount: number;
  timestamp: string;
}

export interface TradeCorridorResponse {
  corridors: TradeCorridor[];
  total_volume: number;
  total_trades: number;
}

// ============================================================================
// Validation Helper Types
// ============================================================================

export type UUID = string; // Format: ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
export type MonetaryAmount = number; // Positive number with max 2 decimal places
export type ISODate = string; // ISO 8601 format
export type Email = string; // RFC 5322 format
export type PhoneNumber = string; // E.164 format
export type PaymentReference = string; // Alphanumeric, 10-50 characters

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  errorId?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
