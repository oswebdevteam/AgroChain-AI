"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { verifyPayment } from '@/lib/services/payment-service';
import type { PaymentVerificationResponse } from '@/lib/services/payment-service';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function PaymentCallbackPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ ref?: string }> 
}) {
  const params = use(searchParams);
  const ref = params.ref;
  const router = useRouter();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'pending' | 'error'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [retryTrigger, setRetryTrigger] = useState(0);
  const [showSlowWarning, setShowSlowWarning] = useState(false);

  useEffect(() => {
    // Handle missing ref parameter
    if (!ref) {
      setStatus('error');
      setMessage('Missing payment reference');
      setTimeout(() => {
        router.push('/orders');
      }, 3000);
      return;
    }

    // Store ref in localStorage for later retry if needed
    if (typeof window !== 'undefined') {
      localStorage.setItem('pending_payment_ref', ref);
    }

    const performVerification = async () => {
      try {
        setStatus('loading');
        setShowSlowWarning(false);
        
        // Set timeout warning after 30 seconds
        const timeoutWarning = setTimeout(() => {
          setShowSlowWarning(true);
        }, 30000);
        
        const result = await verifyPayment(ref);
        clearTimeout(timeoutWarning);

        if (result.status === 'SUCCESS' || result.status === 'SUCCESSFUL') {
          setStatus('success');
          setOrderId(result.orderId || null);
          setMessage(result.message || 'Payment verified successfully');
          
          // Clear stored ref on success
          if (typeof window !== 'undefined') {
            localStorage.removeItem('pending_payment_ref');
          }
          
          // Auto-redirect to order details after 3 seconds
          if (result.orderId) {
            setTimeout(() => {
              router.push(`/orders/${result.orderId}`);
            }, 3000);
          }
        } else if (result.status === 'PENDING') {
          setStatus('pending');
          setMessage(result.message || 'Payment is being processed');
        } else {
          setStatus('failed');
          setMessage(result.message || 'Payment verification failed');
        }
      } catch (error: any) {
        setStatus('failed');
        setMessage(
          error.response?.data?.message || 
          'Could not verify payment. Please check your orders page.'
        );
      }
    };

    performVerification();
  }, [ref, router, retryTrigger]);

  const handleRetry = () => {
    setRetryTrigger(prev => prev + 1);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card variant="glass" className="w-full max-w-md text-center py-12 px-10">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-6">
            <Spinner className="h-16 w-16" />
            <div>
              <h2 className="font-display text-2xl uppercase tracking-tight text-white">
                Verifying payment...
              </h2>
              <p className="text-white/40 mt-2 text-sm">
                Please wait while we confirm your transaction with Interswitch
              </p>
              {showSlowWarning && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-500 text-xs">
                    This is taking longer than usual. You can check the status manually or wait a bit longer.
                  </p>
                  <Button 
                    onClick={handleRetry} 
                    variant="secondary" 
                    className="mt-2 w-full text-xs"
                  >
                    Check Status
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-6 animate-in">
            <div className="h-20 w-20 rounded-full bg-(--color-mint)/20 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-(--color-mint)" />
            </div>
            <div>
              <h2 className="font-display text-3xl uppercase tracking-tight text-white">
                Payment Successful
              </h2>
              <p className="text-white/50 mt-2 text-sm">
                {message || 'Your payment has been verified and funds are secured in escrow'}
              </p>
            </div>
            
            <div className="w-full pt-8 space-y-3">
              <Button asChild className="w-full gap-2">
                <Link href={orderId ? `/orders/${orderId}` : '/orders'}>
                  View Order Details <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/30">
                <ShieldCheck className="h-3 w-3" /> Blockchain Record Created
              </div>
            </div>
          </div>
        )}

        {status === 'pending' && (
          <div className="flex flex-col items-center gap-6 animate-in">
            <div className="h-20 w-20 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Clock className="h-12 w-12 text-yellow-500" />
            </div>
            <div>
              <h2 className="font-display text-3xl uppercase tracking-tight text-white">
                Payment Processing
              </h2>
              <p className="text-white/50 mt-2 text-sm">
                {message || 'Your payment is being processed. This may take a few minutes.'}
              </p>
            </div>
            
            <div className="w-full pt-8 space-y-3">
              <Button onClick={handleRetry} variant="secondary" className="w-full gap-2">
                Check Status Again
              </Button>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/orders">Go to Orders</Link>
              </Button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center gap-6 animate-in">
            <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <div>
              <h2 className="font-display text-3xl uppercase tracking-tight text-white">
                Payment Failed
              </h2>
              <p className="text-white/50 mt-2 text-sm">
                {message || 'We couldn\'t verify your transaction. Please try again.'}
              </p>
            </div>
            
            <div className="w-full pt-8 space-y-3">
              <Button onClick={handleRetry} variant="secondary" className="w-full gap-2">
                Retry Verification
              </Button>
              <Button variant="danger" asChild className="w-full">
                <Link href="/orders">Back to Orders</Link>
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-6 animate-in">
            <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <div>
              <h2 className="font-display text-3xl uppercase tracking-tight text-white">
                Invalid Payment Link
              </h2>
              <p className="text-white/50 mt-2 text-sm">
                {message}. Redirecting to orders page...
              </p>
            </div>
            
            <div className="w-full pt-8">
              <Button asChild className="w-full">
                <Link href="/orders">Go to Orders</Link>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
