"use client";

import React from 'react';
import { CreateOrderForm } from '@/components/orders/CreateOrderForm';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { redirect } from 'next/navigation';

export default function NewOrderPage() {
  const { user } = useAuth();

  if (user?.role !== UserRole.BUYER && user?.role !== UserRole.ADMIN) {
    redirect('/orders');
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl uppercase tracking-tight text-white lg:text-5xl">New Order</h1>
        <p className="mt-2 text-white/50">Initiate a secure produce trade with smart escrow protection.</p>
      </header>

      <div className="animate-in" style={{ animationDelay: '100ms' }}>
        <CreateOrderForm />
      </div>
    </div>
  );
}
