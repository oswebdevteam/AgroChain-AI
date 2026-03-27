"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/otp/verify', { otp });
      toast.success('Identity verified');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="font-display text-4xl uppercase tracking-tight text-white">Verify Identity</h2>
        <p className="mt-2 text-white/50">We sent a 6-digit code to your phone number.</p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <Input
          label="Verification Code"
          type="text"
          placeholder="000000"
          maxLength={6}
          className="text-center text-2xl tracking-[1em] font-bold"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        />

        <Button type="submit" className="w-full" isLoading={loading}>
          Verify & Continue
        </Button>
      </form>

      <button
        onClick={() => toast.success('New code sent')}
        className="text-sm text-(--color-mint) hover:underline"
      >
        Didn&apos;t receive a code? Resend
      </button>
    </div>
  );
}
