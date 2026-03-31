/**
 * Analytics Service
 * 
 * Re-exports analytics functions from the centralized API service
 */

import { 
  getTradeCorridors as apiGetTradeCorridors,
  getFxRate as apiGetFxRate
} from './api-service';
import type { 
  FxRateResponse,
  TradeCorridorParams,
  FxRateParams
} from '@/lib/types/api-types';
import type { TradeCorridor } from '@/types';

export type { TradeCorridor } from '@/types';
export type { FxRateResponse, TradeCorridorParams, FxRateParams } from '@/lib/types/api-types';

// Re-export analytics functions
export const getTradeCorridors = apiGetTradeCorridors;
export const getFxRate = apiGetFxRate;
