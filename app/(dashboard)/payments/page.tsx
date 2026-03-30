"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { type ProduceOrder, OrderStatus } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CreditCard, ArrowUpRight, Filter, Search } from 'lucide-react';
import Link from 'next/link';

export default function PaymentsHistoryPage() {
  const [orders, setOrders] = useState<ProduceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // We filter for orders that are not PENDING (i.e., payment has been attempted/successful)
        const { data } = await api.get('/orders');
        const paidOrders = (data.data || []).filter((o: ProduceOrder) => o.status !== OrderStatus.PENDING && o.status !== OrderStatus.CANCELLED);
        setOrders(paidOrders);
      } catch (error) {
        console.error('Failed to fetch payments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-4xl uppercase tracking-tight text-white lg:text-5xl">Payment History</h1>
        <p className="mt-2 text-white/50">Transaction records for all your secure trade settlements.</p>
      </header>

      <Card variant="solid" className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Produce & ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-white/20 text-sm">Loading transactions...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-white/20 text-sm">No payment records found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-white/30 group-hover:text-(--color-mint) group-hover:bg-(--color-mint)/10 transition-all">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-wide">{order.produce_type}</p>
                          <p className="text-[10px] text-white/30 font-mono">#{order.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-white/50">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-white">
                        {order.currency === 'NGN' ? '₦' : '$'}{order.total_amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="mint" className="bg-(--color-mint)/10">Settled</Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link 
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-(--color-mint) hover:underline"
                      >
                        Details <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
