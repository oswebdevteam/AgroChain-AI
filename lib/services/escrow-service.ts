/**
 * Escrow Service
 * 
 * Re-exports escrow-related functions from the centralized API service
 */

import { 
  getEscrowByOrderId as apiGetEscrowByOrderId,
  releaseEscrow as apiReleaseEscrow
} from './api-service';
import type { 
  ReleaseEscrowData,
  EscrowReleaseResponse
} from '@/lib/types/api-types';
import type { Escrow } from '@/types';

export type { Escrow } from '@/types';
export type { ReleaseEscrowData, EscrowReleaseResponse } from '@/lib/types/api-types';

// Re-export escrow functions
export const getEscrowByOrderId = apiGetEscrowByOrderId;
export const releaseEscrow = apiReleaseEscrow;
