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
} from 'lucide-react';
import api from '@/lib/api';
import { OrderStatus, type ProduceOrder, type FinancialIdentity } from '@/types';
import Link from 'next/link';
import { getFinancialIdentity } from '@/lib/services/api-service';

interface DashboardStats {
  activeTrades: number;
  pendingActions: number;
  escrowVolumeNGN: number;
  creditScore: number | null;
  creditScoreChange: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<ProduceOrder[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    activeTrades: 0,
    pendingActions: 0,
    escrowVolumeNGN: 0,
    creditScore: null,
    creditScoreChange: '—',
  });
  const [financialIdentity, setFinancialIdentity] = useState<FinancialIdentity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const [ordersRes, settlementsRes, identityRes] = await Promise.allSettled([
          api.get('/orders?limit=5'),
          api.get('/analytics/settlement-metrics'),
          user ? getFinancialIdentity(user.id) : Promise.reject(new Error('No user')),
        ]);

        // --- Recent Orders ---
        if (ordersRes.status === 'fulfilled') {
          const orders: ProduceOrder[] = ordersRes.value.data.data ?? [];
          setRecentOrders(orders);

          const active = orders.filter(
            (o) => o.status === OrderStatus.IN_ESCROW || o.status === OrderStatus.PAID
          ).length;
          const pending = orders.filter((o) => o.status === OrderStatus.PENDING).length;

          setStats((prev) => ({ ...prev, activeTrades: active, pendingActions: pending }));
        }

        // --- Settlement Metrics (Escrow Volume) ---
        if (settlementsRes.status === 'fulfilled') {
          const metrics = settlementsRes.value.data.data;
          setStats((prev) => ({ ...prev, escrowVolumeNGN: metrics?.totalVolumeNGN ?? 0 }));
        }

        // --- Financial Identity (Credit Score) ---
        if (identityRes.status === 'fulfilled') {
          const identity: FinancialIdentity = identityRes.value.identity;
          setFinancialIdentity(identity);
          setStats((prev) => ({
            ...prev,
            creditScore: identity?.credit_readiness_score ?? null,
            creditScoreChange: identity?.reliability_rating
              ? `${identity.reliability_rating}/5 reliability`
              : '—',
          }));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const formatNGN = (n: number) => {
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
    return `₦${n.toLocaleString()}`;
  };

  const statCards = [
    { 
      label: 'Active Trades', 
      value: loading ? '...' : String(stats.activeTrades), 
      change: stats.activeTrades > 0 ? `${stats.activeTrades} in progress` : 'None active',
      isPositive: stats.activeTrades > 0, 
      icon: Package,
      color: 'var(--color-mint)',
    },
    { 
      label: 'Escrow Volume', 
      value: loading ? '...' : formatNGN(stats.escrowVolumeNGN), 
      change: 'Total settled', 
      isPositive: true, 
      icon: TrendingUp,
      color: 'var(--color-gold)',
    },
    { 
      label: 'Credit Score', 
      value: loading ? '...' : stats.creditScore != null ? String(stats.creditScore) : 'N/A',
      change: loading ? '—' : stats.creditScoreChange,
      isPositive: true,
      icon: ShieldCheck,
      color: '#86efac',
    },
    { 
      label: 'Pending Actions', 
      value: loading ? '...' : String(stats.pendingActions),
      change: stats.pendingActions > 0 ? 'Needs attention' : 'All clear',
      isPositive: stats.pendingActions === 0, 
      icon: Clock,
      color: '#f87171',
    },
  ];

  const eligibility = financialIdentity?.financing_eligibility;
  const isEligible = eligibility === 'ELIGIBLE';

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-4xl uppercase tracking-tight text-white lg:text-5xl">
          Welcome, {user?.full_name?.split(' ')[0] ?? 'Farmer'}
        </h1>
        <p className="mt-2 text-white/50">Here&apos;s what&apos;s happening with your trade portfolio today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
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
                <Link key={order.id} href={`/orders/${order.id}`} className="block">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
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
                      <p className="text-[10px] font-bold text-(--color-mint) uppercase tracking-widest mt-0.5">
                        {order.status}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>

        {/* AI Insight Sidebar */}
        <Card variant="glass" className="bg-(--color-mint)/5 border-(--color-mint)/10">
          <Badge variant="mint" className="mb-4">AI Insight</Badge>
          {loading ? (
            <p className="text-white/30 text-sm">Analyzing your financial profile...</p>
          ) : financialIdentity ? (
            <>
              <h2 className="font-display text-2xl uppercase leading-tight text-white mb-4">
                {isEligible
                  ? 'You Are Eligible for Financing'
                  : eligibility === 'HIGH_RISK'
                  ? 'High Risk Detected'
                  : 'More Trade Data Needed'}
              </h2>
              <p className="text-sm text-white/70 leading-relaxed mb-8">
                {financialIdentity.risk_indicators?.length > 0
                  ? financialIdentity.risk_indicators[0]?.description
                  : isEligible
                  ? `Your credit score of ${financialIdentity.credit_readiness_score} qualifies you for pre-export financing. Keep your delivery rate high to maintain eligibility.`
                  : 'Complete more trades to build your financial identity and unlock financing options.'}
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl uppercase leading-tight text-white mb-4">
                Build Your Financial Identity
              </h2>
              <p className="text-sm text-white/70 leading-relaxed mb-8">
                Complete your first trade to generate your AI-powered credit profile and unlock pre-export financing.
              </p>
            </>
          )}
          <div className="space-y-3">
            <Button variant="mint" className="w-full" asChild>
              <Link href="/ai-identity">View Full Identity Report</Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/orders/new">Create New Order</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
