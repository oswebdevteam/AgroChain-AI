/**
 * Financial Identity Service
 * 
 * Re-exports financial identity functions from the centralized API service
 */

import { 
  getFinancialIdentity as apiGetFinancialIdentity,
  analyzeFinancialIdentity as apiAnalyzeFinancialIdentity 
} from './api-service';
import type { FinancialIdentity } from '@/types';

export type { FinancialIdentity } from '@/types';

// Re-export financial identity functions
export const getFinancialIdentity = apiGetFinancialIdentity;
export const analyzeFinancialIdentity = apiAnalyzeFinancialIdentity;
