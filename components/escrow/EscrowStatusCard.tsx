"use client";

import React, { use } from 'react';
import { Badge } from '@/components/ui/Badge';
import { EscrowStatus } from '@/types';
import { Box, Lock, Unlock, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EscrowStatusCard({ 
  status, 
  amount, 
  currency = 'NGN' 
}: { 
  status: EscrowStatus; 
  amount: number;
  currency?: string;
}) {
  const steps = [
    { label: 'Funds Locked', id: EscrowStatus.HELD, icon: Lock },
    { label: 'Settled to Seller', id: EscrowStatus.RELEASED, icon: Unlock },
    { label: 'Refunded to Buyer', id: EscrowStatus.REFUNDED, icon: RefreshCcw },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg uppercase tracking-wider text-white">Escrow Status</h3>
        <Badge variant={status === EscrowStatus.HELD ? 'gold' : status === EscrowStatus.RELEASED ? 'mint' : 'danger'}>
          {status}
        </Badge>
      </div>

      <div className="relative flex justify-between">
        <div className="absolute left-0 top-5 h-0.5 w-full bg-white/10" />
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex && status !== EscrowStatus.REFUNDED;
          const isRefunded = status === EscrowStatus.REFUNDED && step.id === EscrowStatus.REFUNDED;
          const isActive = step.id === status;

          if (step.id === EscrowStatus.REFUNDED && status !== EscrowStatus.REFUNDED) return null;
          if (step.id === EscrowStatus.RELEASED && status === EscrowStatus.REFUNDED) return null;

          return (
            <div key={step.id} className="relative flex flex-col items-center gap-3 z-10 w-24 text-center">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-4 border-(--color-forest) transition-all",
                isActive ? "bg-(--color-gold) text-(--color-forest) scale-125 shadow-[0_0_20px_rgba(240,192,64,0.3)]" : 
                isCompleted ? "bg-(--color-mint) text-(--color-forest)" : "bg-white/10 text-white/30"
              )}>
                <step.icon className="h-4 w-4" />
              </div>
              <p className={cn("text-[10px] font-bold uppercase tracking-widest", isActive ? "text-white" : "text-white/30")}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-white/10 mt-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">Amount Protected</span>
          <span className="font-display text-xl text-white">
            {currency === 'NGN' ? '₦' : '$'}{amount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
