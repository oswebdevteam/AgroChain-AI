"use client";

import React, { useEffect, useState, use } from 'react';
import api from '@/lib/api';
import { type Escrow, EscrowStatus, UserRole } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EscrowStatusCard } from '@/components/escrow/EscrowStatusCard';
import { ArrowLeft, ShieldCheck, ExternalLink, RefreshCcw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function EscrowDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [escrow, setEscrow] = useState<Escrow | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEscrow = async () => {
    try {
      const { data } = await api.get(`/escrow/${orderId}`);
      setEscrow(data.data);
    } catch (error) {
      console.error('Failed to fetch escrow', error);
      toast.error('Could not load escrow details');
      router.push(`/orders/${orderId}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscrow();
  }, [orderId]);

  const handleAdminAction = async (action: 'release' | 'refund') => {
    if (!confirm(`Are you sure you want to ${action} these funds?`)) return;
    setActionLoading(true);
    try {
      await api.post(`/escrow/${orderId}/${action}`, action === 'refund' ? { reason: 'Admin manual refund' } : {});
      toast.success(`Funds ${action}ed successfully`);
      fetchEscrow();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} funds`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-white/30">Loading escrow details...</div>;
  if (!escrow) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href={`/orders/${orderId}`} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-all">
          <ArrowLeft className="h-4 w-4" /> Back to Order
        </Link>
      </div>

      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-(--color-gold)/10 px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-(--color-gold) mb-4">
          <ShieldCheck className="h-3 w-3" /> Smart Escrow Instance
        </div>
        <h1 className="font-display text-4xl uppercase tracking-tight text-white lg:text-5xl">
          Secure Settlement
        </h1>
        <p className="mt-2 text-white/50 overflow-hidden text-ellipsis">Reference: {escrow.payment_reference}</p>
      </header>

      <Card variant="glass" className="p-10">
        <EscrowStatusCard status={escrow.status} amount={escrow.amount} />
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card variant="solid">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Metadata</h3>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-white/30 uppercase">TX Hash</p>
              <p className="text-xs font-mono text-white/70 truncate mt-1">
                {escrow.blockchain_tx_hash || 'Pending on-chain validation...'}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase">Timestamp</p>
              <p className="text-xs text-white/70 mt-1">{new Date(escrow.created_at).toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {user?.role === UserRole.ADMIN && escrow.status === EscrowStatus.HELD && (
          <Card variant="glass" className="border-red-500/20 bg-red-500/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-red-500/70 mb-4">Admin Controls</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleAdminAction('release')} 
                className="gap-2" 
                isLoading={actionLoading}
              >
                <CheckCircle2 className="h-4 w-4" /> Release
              </Button>
              <Button 
                onClick={() => handleAdminAction('refund')} 
                variant="danger" 
                className="gap-2" 
                isLoading={actionLoading}
              >
                <RefreshCcw className="h-4 w-4" /> Refund
              </Button>
            </div>
          </Card>
        )}
      </div>

      {escrow.blockchain_tx_hash && (
        <a 
          href={`https://sepolia.basescan.org/tx/${escrow.blockchain_tx_hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card variant="outline" className="flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-white/30 group-hover:text-(--color-mint) transition-colors" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">View on Blockchain</p>
                <p className="text-xs text-white/30">Verify this escrow state on BaseScan</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/40 transition-colors" />
          </Card>
        </a>
      )}
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
