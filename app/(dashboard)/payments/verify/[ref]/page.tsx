"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function PaymentVerifyPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = use(params);
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await api.get(`/payments/verify/${ref}`);
        if (data.status === 'SUCCESS' || data.status === 'SUCCESSFUL') {
          setStatus('success');
          setOrderId(data.orderId);
        } else {
          setStatus('failed');
        }
      } catch (error) {
        setStatus('failed');
      }
    };
    verify();
  }, [ref]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card variant="glass" className="w-full max-w-md text-center py-12 px-10">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-6">
            <Spinner className="h-16 w-16" />
            <div>
              <h2 className="font-display text-2xl uppercase tracking-tight text-white">Verifying Payment</h2>
              <p className="text-white/40 mt-2 text-sm">Please wait while we confirm your transaction with Interswitch...</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-6 animate-in">
            <div className="h-20 w-20 rounded-full bg-(--color-mint)/20 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-(--color-mint)" />
            </div>
            <div>
              <h2 className="font-display text-3xl uppercase tracking-tight text-white">Payment Secure</h2>
              <p className="text-white/50 mt-2 text-sm">Funds have been locked in escrow. The farmer will be notified to begin delivery.</p>
            </div>
            
            <div className="w-full pt-8 space-y-3">
              <Button asChild className="w-full gap-2">
                <Link href={orderId ? `/orders/${orderId}` : '/orders'}>
                  Go to Order Details <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/30">
                <ShieldCheck className="h-3 w-3" /> Blockchain Record Created
              </div>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center gap-6 animate-in">
            <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <div>
              <h2 className="font-display text-3xl uppercase tracking-tight text-white">Payment Failed</h2>
              <p className="text-white/50 mt-2 text-sm">We couldn&apos;t verify your transaction. Please check your bank and try again.</p>
            </div>
            
            <div className="w-full pt-8">
              <Button variant="danger" asChild className="w-full">
                <Link href="/orders">Back to Orders</Link>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
