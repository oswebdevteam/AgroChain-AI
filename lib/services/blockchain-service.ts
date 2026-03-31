/**
 * Blockchain Service
 * 
 * Re-exports blockchain-related functions from the centralized API service
 */

import { getBlockchainProof as apiGetBlockchainProof } from './api-service';
import type { BlockchainProof } from '@/types';

export type { BlockchainProof } from '@/types';

// Re-export blockchain functions
export const getBlockchainProof = apiGetBlockchainProof;
