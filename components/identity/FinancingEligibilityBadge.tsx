import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { FinancingEligibility } from '@/types';

export function FinancingEligibilityBadge({ eligibility }: { eligibility: FinancingEligibility }) {
  const styles: Record<FinancingEligibility, { variant: 'mint' | 'gold' | 'danger', label: string }> = {
    [FinancingEligibility.ELIGIBLE]: { variant: 'mint', label: 'Eligible for Financing' },
    [FinancingEligibility.NEEDS_MORE_DATA]: { variant: 'gold', label: 'Needs More Trade Volume' },
    [FinancingEligibility.HIGH_RISK]: { variant: 'danger', label: 'High Risk' },
  };

  const { variant, label } = styles[eligibility] || { variant: 'gold', label: eligibility };

  return (
    <Badge variant={variant} className="px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
      {label}
    </Badge>
  );
}
