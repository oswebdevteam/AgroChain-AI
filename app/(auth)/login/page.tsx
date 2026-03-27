"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
    } catch (error) {
      // Error is handled in AuthContext/toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-4xl uppercase tracking-tight text-white">Welcome Back</h2>
        <p className="mt-2 text-white/50">Enter your credentials to access your trade dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-white/50 cursor-pointer">
            <input type="checkbox" className="rounded border-white/10 bg-white/5 text-(--color-mint)" />
            Remember me
          </label>
          <a href="#" className="text-(--color-mint) hover:underline">Forgot password?</a>
        </div>

        <Button type="submit" className="w-full" isLoading={loading}>
          Sign In to AgroChain
        </Button>
      </form>

      <p className="text-center text-sm text-white/50">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-(--color-mint) font-semibold hover:underline">
          Create one now
        </Link>
      </p>
    </div>
  );
}
