import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { OrderStatus } from '@/types';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variants: Record<OrderStatus, 'mint' | 'gold' | 'danger' | 'ghost' | 'ink'> = {
    [OrderStatus.PENDING]: 'gold',
    [OrderStatus.PAID]: 'mint',
    [OrderStatus.IN_ESCROW]: 'mint',
    [OrderStatus.DELIVERED]: 'mint',
    [OrderStatus.COMPLETED]: 'ink',
    [OrderStatus.CANCELLED]: 'danger',
  };

  const labels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Pending Payment',
    [OrderStatus.PAID]: 'Processing',
    [OrderStatus.IN_ESCROW]: 'In Escrow',
    [OrderStatus.DELIVERED]: 'Delivered',
    [OrderStatus.COMPLETED]: 'Completed',
    [OrderStatus.CANCELLED]: 'Cancelled',
  };

  return (
    <Badge variant={variants[status] || 'ghost'} className="uppercase tracking-[0.1em] text-[10px] px-2 py-0.5">
      {labels[status] || status}
    </Badge>
  );
}
