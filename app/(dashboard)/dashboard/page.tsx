"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  TrendingUp, 
  Package, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import api from '@/lib/api';
import { OrderStatus, type ProduceOrder } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<ProduceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/orders?limit=5');
        setRecentOrders(data.orders || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { 
      label: 'Active Trades', 
      value: '12', 
      change: '+2', 
      isPositive: true, 
      icon: Package,
      color: 'var(--color-mint)'
    },
    { 
      label: 'Escrow Volume', 
      value: '₦4.2M', 
      change: '+18.4%', 
      isPositive: true, 
      icon: TrendingUp,
      color: 'var(--color-gold)'
    },
    { 
      label: 'Credit Score', 
      value: '820', 
      change: 'Stable', 
      isPositive: true, 
      icon: ShieldCheck,
      color: '#86efac'
    },
    { 
      label: 'Pending Actions', 
      value: '3', 
      change: '-1', 
      isPositive: false, 
      icon: Clock,
      color: '#f87171'
    },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-4xl uppercase tracking-tight text-white lg:text-5xl">
          Welcome, {user?.full_name?.split(' ')[0]}
        </h1>
        <p className="mt-2 text-white/50">Here&apos;s what&apos;s happening with your trade portfolio today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} variant="glass" className="group hover:border-white/20 transition-all">
            <div className="flex items-start justify-between">
              <div 
                className="rounded-2xl p-3" 
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <Badge variant={stat.isPositive ? 'mint' : 'danger'} className="text-[10px] font-bold">
                {stat.change}
              </Badge>
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-white/30">{stat.label}</p>
              <p className="mt-1 font-display text-3xl text-white">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card variant="solid" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-xl uppercase tracking-wider text-white">Recent Orders</h2>
            <Link href="/orders" className="text-sm text-(--color-mint) font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-white/30 text-center py-10">Loading orders...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-white/30 text-center py-10">No recent orders found.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-mint)/10 text-(--color-mint)">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-wide">{order.produce_type}</p>
                      <p className="text-xs text-white/40">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">
                      {order.currency === 'NGN' ? '₦' : '$'}{order.total_amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-(--color-mint) uppercase tracking-widest mt-0.5 pointer-events-none">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* AI Insight Sidebar */}
        <Card variant="glass" className="bg-(--color-mint)/5 border-(--color-mint)/10">
          <Badge variant="mint" className="mb-4">AI Insight</Badge>
          <h2 className="font-display text-2xl uppercase leading-tight text-white mb-4">
            Your Credit Readiness is Rising
          </h2>
          <p className="text-sm text-white/70 leading-relaxed mb-8">
            Based on your last 3 successful settlements, your credit score has increased by 12 points. You are now eligible for pre-export financing up to ₦1.5M.
          </p>
          <div className="space-y-3">
            <Button variant="mint" className="w-full">Explore Financing</Button>
            <Button variant="ghost" className="w-full">View Identity Report</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
