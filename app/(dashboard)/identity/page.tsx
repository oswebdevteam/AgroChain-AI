"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { type FinancialIdentity, UserRole } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CreditScoreCard } from '@/components/identity/CreditScoreCard';
import { FinancingEligibilityBadge } from '@/components/identity/FinancingEligibilityBadge';
import { ShieldCheck, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { getFinancialIdentity, analyzeFinancialIdentity } from '@/lib/services/api-service';

export default function IdentityPage() {
  const { user } = useAuth();
  const [identity, setIdentity] = useState<FinancialIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchIdentity = async () => {
    if (!user) return;
    try {
      const identity = await getFinancialIdentity(user.id);
      setIdentity(identity);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Identity not yet created (needs first trade) or endpoint not available
        setIdentity(null);
      } else {
        console.error('Failed to fetch financial identity:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdentity();
  }, [user]);

  const handleAnalyze = async () => {
    if (!user) return;
    setAnalyzing(true);
    try {
      await analyzeFinancialIdentity(user.id);
      toast.success('AI re-analysis complete');
      fetchIdentity();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Re-analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-white/30">Analyzing your financial footprint...</div>;

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight text-white lg:text-5xl">Financial Identity</h1>
          <p className="mt-2 text-white/50">Your AI-driven creditworthiness and trade reliability profile.</p>
        </div>
        {user?.role === UserRole.ADMIN && (
          <Button onClick={handleAnalyze} isLoading={analyzing} variant="secondary">
            Trigger AI Re-analysis
          </Button>
        )}
      </header>

      {!identity ? (
        <Card variant="glass" className="text-center py-20">
          <div className="mx-auto h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Info className="h-10 w-10 text-white/20" />
          </div>
          <h2 className="font-display text-2xl uppercase text-white mb-2">No Identity Profile Found</h2>
          <p className="text-white/40 max-w-sm mx-auto">
            You need to complete at least one trade and escrow settlement to begin generating your financial identity.
          </p>
          <Button asChild className="mt-8" variant="mint">
            <a href="/orders/new">Start Your First Trade</a>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Credit Score & Eligibility */}
          <Card variant="solid" className="flex flex-col items-center justify-center py-10">
            <CreditScoreCard score={identity.credit_readiness_score} />
            <div className="mt-10 w-full pt-8 border-t border-white/5 text-center">
              <FinancingEligibilityBadge eligibility={identity.financing_eligibility} />
              <p className="text-[10px] text-white/30 mt-4 uppercase tracking-widest">
                Last updated: {new Date(identity.last_updated_at).toLocaleDateString()}
              </p>
            </div>
          </Card>

          {/* Trade Reliability & Summary */}
          <div className="lg:col-span-2 space-y-8">
            <section className="grid gap-6 sm:grid-cols-2">
              <Card variant="glass">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="h-5 w-5 text-(--color-mint)" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Settlement Reliability</h3>
                </div>
                <div className="flex items-end gap-3">
                  <span className="font-display text-5xl text-white">{identity.reliability_rating}%</span>
                  <span className="text-[10px] text-(--color-mint) font-bold uppercase mb-1">On-Time</span>
                </div>
                <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-(--color-mint)" 
                    style={{ width: `${identity.reliability_rating}%` }} 
                  />
                </div>
              </Card>

              <Card variant="glass">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="h-5 w-5 text-(--color-gold)" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Trade Integrity</h3>
                </div>
                <div className="flex items-end gap-3">
                  <span className="font-display text-5xl text-white">
                    {(100 - (identity.transaction_history_summary.dispute_rate * 100)).toFixed(0)}%
                  </span>
                  <span className="text-[10px] text-(--color-gold) font-bold uppercase mb-1">Dispute Free</span>
                </div>
                <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-(--color-gold)" 
                    style={{ width: `${100 - (identity.transaction_history_summary.dispute_rate * 100)}%` }} 
                  />
                </div>
              </Card>
            </section>

            {/* Risk Indicators */}
            <Card variant="solid">
              <h3 className="font-display text-xl uppercase tracking-wider text-white mb-6">Risk Indicators</h3>
              <div className="space-y-4">
                {identity.risk_indicators.length === 0 ? (
                  <p className="text-center py-6 text-white/20 text-sm">No significant risks identified.</p>
                ) : (
                  identity.risk_indicators.map((risk, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className={cn(
                        "mt-1 rotate-180 h-8 w-8 rounded-lg flex items-center justify-center",
                        risk.severity === 'HIGH' ? 'bg-red-500/10 text-red-500' : 
                        risk.severity === 'MEDIUM' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'
                      )}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="text-sm font-bold text-white uppercase tracking-wide">{risk.indicator}</p>
                           <Badge variant={risk.severity === 'HIGH' ? 'danger' : 'gold'} className="text-[8px] px-1.5 py-0">
                             {risk.severity}
                           </Badge>
                        </div>
                        <p className="text-xs text-white/40 mt-1">{risk.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Stats Summary */}
            <Card variant="outline" className="grid grid-cols-2 md:grid-cols-4 gap-6 border-white/5">
               <div>
                  <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Total Trades</p>
                  <p className="text-xl font-display text-white mt-1">{identity.transaction_history_summary.total_trades}</p>
               </div>
               <div>
                  <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Volume (NGN)</p>
                  <p className="text-xl font-display text-white mt-1">
                    ₦{(identity.transaction_history_summary.total_volume / 1000000).toFixed(1)}M
                  </p>
               </div>
               <div>
                  <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Avg Order</p>
                  <p className="text-xl font-display text-white mt-1">
                    ₦{(identity.transaction_history_summary.avg_order_value / 1000).toFixed(0)}k
                  </p>
               </div>
               <div>
                  <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Tenure</p>
                  <p className="text-xl font-display text-white mt-1">{identity.transaction_history_summary.months_active}m</p>
               </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
