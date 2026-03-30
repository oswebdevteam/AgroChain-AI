"use client";

import React, { useEffect, useState, use } from 'react';
import api from '@/lib/api';
import { type ProduceOrder, OrderStatus, UserRole } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { 
  Package, 
  MapPin, 
  Calendar, 
  User, 
  ArrowLeft, 
  ExternalLink,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<ProduceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.data);
    } catch (error) {
      console.error('Failed to fetch order', error);
      toast.error('Could not load order details');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleConfirmDelivery = async () => {
    if (!confirm('Are you sure you want to confirm delivery? This will move the order to DELIVERED status.')) return;
    setActionLoading(true);
    try {
      await api.post(`/orders/${id}/confirm-delivery`, { proofUrl: 'https://placeholder-proof.com' });
      toast.success('Delivery confirmed');
      fetchOrder();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to confirm delivery');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setActionLoading(true);
    try {
      await api.post(`/orders/${id}/cancel`);
      toast.success('Order cancelled');
      fetchOrder();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleInitiatePayment = async () => {
    setActionLoading(true);
    try {
      const { data } = await api.post('/payments/initiate', { orderId: id });
      toast.success('Payment initiated');
      if (data.data?.redirectUrl) {
        window.location.href = data.data.redirectUrl;
      } else {
        fetchOrder();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-white/30">Loading order...</div>;
  if (!order) return null;

  const isBuyer = user?.id === order.buyer_id || user?.role === UserRole.ADMIN;
  const isSeller = user?.id === order.seller_id || user?.role === UserRole.ADMIN;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/orders" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-all">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          {order.status === OrderStatus.COMPLETED && (
            <Link href={`/blockchain/${order.id}`}>
              <Badge variant="gold" className="gap-1 cursor-pointer">
                <ShieldCheck className="h-3 w-3" /> Blockchain Proof
              </Badge>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <header>
            <h1 className="font-display text-4xl uppercase tracking-tight text-white lg:text-6xl">
              {order.produce_type}
            </h1>
            <div className="flex flex-wrap items-center gap-6 mt-4 text-white/40">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{order.delivery_address}</span>
              </div>
            </div>
          </header>

          <Card variant="solid" className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Quantity</p>
              <p className="mt-2 text-xl font-bold text-white">{order.quantity} {order.unit}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Unit Price</p>
              <p className="mt-2 text-xl font-bold text-white">
                {order.currency === 'NGN' ? '₦' : '$'}{order.unit_price.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Total Amount</p>
              <p className="mt-2 text-2xl font-display text-(--color-gold)">
                {order.currency === 'NGN' ? '₦' : '$'}{order.total_amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">ID</p>
              <p className="mt-2 text-xs text-white/30 font-mono truncate">{order.id}</p>
            </div>
          </Card>

          <section className="space-y-4">
            <h3 className="font-display text-lg uppercase tracking-wider text-white">Transaction Notes</h3>
            <Card variant="outline" className="text-sm leading-relaxed text-white/60">
              {order.notes || 'No notes provided for this order.'}
            </Card>
          </section>

          {/* Timeline / Progress placeholder */}
          <section className="space-y-6">
             <h3 className="font-display text-lg uppercase tracking-wider text-white">Trade Progress</h3>
             <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                <div className="relative">
                  <div className={cn("absolute -left-[25px] h-4 w-4 rounded-full border-4 border-(--color-forest)", order.created_at ? 'bg-(--color-mint)' : 'bg-white/20')} />
                  <p className="text-sm font-bold text-white">Order Created</p>
                  <p className="text-xs text-white/40">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="relative">
                  <div className={cn("absolute -left-[25px] h-4 w-4 rounded-full border-4 border-(--color-forest)", order.status !== OrderStatus.PENDING ? 'bg-(--color-mint)' : 'bg-white/20')} />
                  <p className="text-sm font-bold text-white">Payment & Escrow Locked</p>
                  <p className="text-xs text-white/40">Funds secured via Interswitch</p>
                </div>
                <div className="relative">
                  <div className={cn("absolute -left-[25px] h-4 w-4 rounded-full border-4 border-(--color-forest)", (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.COMPLETED) ? 'bg-(--color-mint)' : 'bg-white/20')} />
                  <p className="text-sm font-bold text-white">Delivery Confirmed</p>
                  <p className="text-xs text-white/40">Verified by seller</p>
                </div>
             </div>
          </section>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card variant="glass" className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                <User className="h-5 w-5 text-white/50" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Counterparty</p>
                <p className="text-sm font-bold text-white">Agro Trader #...{order.seller_id.slice(-4)}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              {order.status === OrderStatus.PENDING && isBuyer && (
                <Button onClick={handleInitiatePayment} className="w-full gap-2" isLoading={actionLoading}>
                  <CreditCard className="h-4 w-4" /> Pay & Lock Escrow
                </Button>
              )}
              
              {order.status === OrderStatus.IN_ESCROW && isSeller && (
                <Button onClick={handleConfirmDelivery} className="w-full gap-2" isLoading={actionLoading} variant="gold">
                  <CheckCircle2 className="h-4 w-4" /> Confirm Delivery
                </Button>
              )}

              {order.status === OrderStatus.PENDING && isBuyer && (
                <Button onClick={handleCancelOrder} variant="danger" className="w-full gap-2" isLoading={actionLoading}>
                  <XCircle className="h-4 w-4" /> Cancel Order
                </Button>
              )}

              <Button variant="secondary" className="w-full gap-2" asChild>
                <Link href={`/escrow/${order.id}`}>
                  View Escrow State
                </Link>
              </Button>
            </div>
          </Card>

          <Card variant="outline" className="bg-white/5 border-dashed">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Escrow Protection</h4>
            <p className="text-xs text-white/40 leading-relaxed">
              Funds are held by AgroChain AI until delivery is confirmed. Once confirmed, funds are automatically settled to the farmer's wallet.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
