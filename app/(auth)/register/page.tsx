"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: UserRole.BUYER,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-4xl uppercase tracking-tight text-white">Join the Chain</h2>
        <p className="mt-2 text-white/50">Start building your financial identity today.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: UserRole.BUYER })}
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all ${
              formData.role === UserRole.BUYER
                ? 'border-(--color-mint) bg-(--color-mint)/10 text-(--color-mint)'
                : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30'
            }`}
          >
            <span className="text-2xl">🛒</span>
            <span className="text-xs font-bold uppercase tracking-widest">Buyer</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: UserRole.SELLER })}
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all ${
              formData.role === UserRole.SELLER
                ? 'border-(--color-mint) bg-(--color-mint)/10 text-(--color-mint)'
                : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30'
            }`}
          >
            <span className="text-2xl">🌱</span>
            <span className="text-xs font-bold uppercase tracking-widest">Farmer</span>
          </button>
        </div>

        <Input
          label="Full Name"
          placeholder="John Doe"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+234 ..."
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <Button type="submit" className="w-full" isLoading={loading}>
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-white/50">
        Already have an account?{' '}
        <Link href="/login" className="text-(--color-mint) font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
