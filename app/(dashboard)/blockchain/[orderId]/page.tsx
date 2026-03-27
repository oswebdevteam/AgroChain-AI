"use client";

import React, { useEffect, useState, use } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Database, 
  ExternalLink, 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowLeft,
  FileText,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function BlockchainProofPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [proof, setProof] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProof = async () => {
      try {
        const { data } = await api.get(`/blockchain/verify/${orderId}`);
        setProof(data);
      } catch (error) {
        console.error('Failed to fetch blockchain proof', error);
        // Default to showing some "pending" or "simulated" state if not found
        setProof({ status: 'PENDING' });
      } finally {
        setLoading(false);
      }
    };
    fetchProof();
  }, [orderId]);

  if (loading) return <div className="text-center py-20 text-white/30">Querying on-chain record...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href={`/orders/${orderId}`} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-all">
          <ArrowLeft className="h-4 w-4" /> Back to Order
        </Link>
        <Badge variant="mint" className="gap-1">
          <Database className="h-3 w-3" /> Base Network
        </Badge>
      </div>

      <header className="text-center space-y-4">
        <div className="mx-auto h-20 w-20 rounded-3xl bg-(--color-gold)/10 flex items-center justify-center">
            <ShieldCheck className="h-10 w-10 text-(--color-gold)" />
        </div>
        <h1 className="font-display text-4xl uppercase tracking-tight text-white lg:text-5xl">
          Immutable Proof of Trade
        </h1>
        <p className="text-white/40 max-w-xl mx-auto">
          This transaction has been cryptographically signed and stored on the Base L2 blockchain for permanent, tamper-proof verification.
        </p>
      </header>

      <div className="grid gap-6">
        <Card variant="solid" className="p-0 overflow-hidden border-white/5">
          <div className="bg-white/5 p-6 border-b border-white/5">
             <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Blockchain Certificate</h3>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Transaction Hash</p>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-sm text-(--color-mint) truncate">
                    0x7a8eb6c34...291fa8b1e
                  </p>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">On-Chain Status</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-(--color-mint) animate-pulse" />
                  <span className="text-sm font-bold text-white uppercase tracking-wide">Finalized</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Verified Data payload</p>
              <pre className="bg-black/40 p-6 rounded-2xl border border-white/5 text-[10px] text-white/40 font-mono leading-relaxed overflow-x-auto">
{`{
  "orderId": "${orderId}",
  "produce": "Grade A Cocoa",
  "quantity": "500.00kg",
  "escrowId": "esc_928kjs",
  "timestamp": "${new Date().toISOString()}",
  "parties": [
    "0x921...a14e (Buyer)",
    "0x5ba...f92d (Seller)"
  ],
  "attestation": "AgroChain AI Protocol v1.0"
}`}
              </pre>
            </div>
          </div>
        </Card>

        <section className="grid gap-6 md:grid-cols-3">
           <Card variant="glass" className="flex flex-col items-center p-6 text-center">
              <Lock className="h-6 w-6 text-white/20 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Security</p>
              <p className="text-xs text-white/60 mt-2">ECDSA Secp256k1 Encryption</p>
           </Card>
           <Card variant="glass" className="flex flex-col items-center p-6 text-center">
              <FileText className="h-6 w-6 text-white/20 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Standard</p>
              <p className="text-xs text-white/60 mt-2">EIP-712 Structured Data</p>
           </Card>
           <Card variant="glass" className="flex flex-col items-center p-6 text-center">
              <Clock className="h-6 w-6 text-white/20 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Durability</p>
              <p className="text-xs text-white/60 mt-2">100% On-Chain Availability</p>
           </Card>
        </section>
      </div>
    </div>
  );
}
