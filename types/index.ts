export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  IN_ESCROW = 'IN_ESCROW',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum EscrowStatus {
  HELD = 'HELD',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED',
}

export enum KycStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum TransactionType {
  PAYMENT = 'PAYMENT',
  ESCROW_HOLD = 'ESCROW_HOLD',
  ESCROW_RELEASE = 'ESCROW_RELEASE',
  REFUND = 'REFUND',
  PAYOUT = 'PAYOUT',
}

export enum FinancingEligibility {
  ELIGIBLE = 'ELIGIBLE',
  NEEDS_MORE_DATA = 'NEEDS_MORE_DATA',
  HIGH_RISK = 'HIGH_RISK',
}

export enum Currency {
  NGN = 'NGN',
  USD = 'USD',
}

export interface Profile {
  id: string;
  role: UserRole;
  phone: string | null;
  email: string;
  wallet_address: string | null;
  kyc_status: KycStatus;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface FarmerProfile {
  id: string;
  user_id: string;
  farm_name: string;
  farm_location: string;
  farm_size_hectares: number | null;
  produce_types: string[];
  description: string | null;
}

export interface ProduceOrder {
  id: string;
  buyer_id: string;
  seller_id: string;
  produce_type: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_amount: number;
  currency: Currency;
  status: OrderStatus;
  delivery_address: string;
  delivery_proof_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  seller?: Profile;
  buyer?: Profile;
}

export interface Escrow {
  id: string;
  order_id: string;
  amount: number;
  status: EscrowStatus;
  payment_reference: string;
  blockchain_tx_hash: string | null;
  created_at: string;
  released_at: string | null;
}

export interface RiskIndicator {
  indicator: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
}

export interface FinancialIdentity {
  id: string;
  user_id: string;
  credit_readiness_score: number;
  risk_indicators: RiskIndicator[];
  reliability_rating: number;
  financing_eligibility: FinancingEligibility;
  last_updated_at: string;
  transaction_history_summary: {
    total_trades: number;
    total_volume: number;
    avg_order_value: number;
    on_time_delivery_rate: number;
    dispute_rate: number;
    cancellation_rate: number;
    trade_frequency_per_month: number;
    months_active: number;
  };
}

export interface BlockchainProof {
  order_id: string;
  event_type: string;
  tx_hash: string;
  block_number: number;
  timestamp: string;
  base_scan_url?: string;
}

export interface TradeCorridor {
  produce_type: string;
  total_volume: number;
  trade_count: number;
  avg_settlement_days: number;
}

export interface SettlementMetrics {
  avg_settlement_time: number;
  success_rate: number;
  total_settled_volume: number;
}
