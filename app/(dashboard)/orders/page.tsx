"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { OrderStatus, type ProduceOrder, UserRole } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { Search, Filter, Plus, ChevronRight, Package } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<ProduceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.data || []);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.produce_type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight text-white lg:text-5xl">Orders</h1>
          <p className="mt-2 text-white/50">Manage your active and completed produce trades.</p>
        </div>
        {user?.role === UserRole.BUYER && (
          <Button asChild>
            <Link href="/orders/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> New Order
            </Link>
          </Button>
        )}
      </div>

      <Card variant="glass" className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by produce type (e.g. Cocoa)..."
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none focus:border-(--color-mint) transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white/30" />
            <select
              className="h-12 rounded-xl border border-white/10 bg-(--color-forest) px-4 text-sm text-white outline-none focus:border-(--color-mint) transition-all min-w-[150px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              {Object.values(OrderStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-white/30">Loading your orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-white/30 border border-dashed border-white/10 rounded-3xl">
            No orders found matching your filters.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <div className="group relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 hover:border-(--color-mint)/40 hover:bg-white/10 transition-all sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-mint)/10 text-(--color-mint) group-hover:scale-110 transition-transform">
                    <Package className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-wider text-white">
                      {order.produce_type}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
                      <span>{order.quantity} {order.unit}</span>
                      <span>•</span>
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2">
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      {order.currency === 'NGN' ? '₦' : '$'}{order.total_amount.toLocaleString()}
                    </p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/20 group-hover:translate-x-1 group-hover:text-(--color-mint) transition-all" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
