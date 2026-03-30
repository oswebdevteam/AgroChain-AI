"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Currency } from '@/types';
import { FarmerSelect } from './FarmerSelect';

export function CreateOrderForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sellerId: '', // In a real app, this would be selected from a list of farmers
    produceType: '',
    quantity: 0,
    unit: 'kg',
    unitPrice: 0,
    currency: Currency.NGN,
    deliveryAddress: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/orders', formData);
      toast.success('Order created successfully');
      router.push(`/orders/${data.order.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="solid" className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Produce Type"
            placeholder="e.g. Grade A Cocoa Beans"
            required
            value={formData.produceType}
            onChange={(e) => setFormData({ ...formData, produceType: e.target.value })}
          />
          <FarmerSelect
            value={formData.sellerId}
            onChange={(id) => setFormData({ ...formData, sellerId: id })}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Input
            label="Quantity"
            type="number"
            min="1"
            required
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
          />
          <Input
            label="Unit"
            placeholder="kg, tons, etc."
            required
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Currency</label>
            <select
              className="h-12 w-full rounded-2xl border border-white/10 bg-(--color-forest) px-4 text-sm text-white outline-none focus:border-(--color-mint)"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
            >
              <option value={Currency.NGN}>NGN (₦)</option>
              <option value={Currency.USD}>USD ($)</option>
            </select>
          </div>
        </div>

        <Input
          label="Unit Price"
          type="number"
          min="0"
          step="0.01"
          required
          value={formData.unitPrice}
          onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
        />

        <Input
          label="Delivery Address"
          placeholder="Full warehouse or port address"
          required
          value={formData.deliveryAddress}
          onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Additional Notes</label>
          <textarea
            className="min-h-[100px] w-full rounded-2xl border border-white/10 bg-(--color-forest) p-4 text-sm text-white outline-none focus:border-(--color-mint)"
            placeholder="Moisture content requirements, packaging specs, etc..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-8">
          <div className="text-sm">
            <span className="text-white/40">Estimated Total:</span>
            <span className="ml-2 font-display text-xl text-(--color-gold)">
              {formData.currency === Currency.NGN ? '₦' : '$'}
              {(formData.quantity * formData.unitPrice).toLocaleString()}
            </span>
          </div>
          <Button type="submit" isLoading={loading}>
            Initiate Order & Escrow
          </Button>
        </div>
      </form>
    </Card>
  );
}
