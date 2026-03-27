"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  BarChart3, 
  TrendingUp, 
  Map as MapIcon, 
  Globe, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/analytics/trade-corridors');
        setData(data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const tradeData = [
    { name: 'Jan', volume: 4200, trades: 12 },
    { name: 'Feb', volume: 5100, trades: 15 },
    { name: 'Mar', volume: 3800, trades: 10 },
    { name: 'Apr', volume: 7200, trades: 22 },
    { name: 'May', volume: 6100, trades: 18 },
    { name: 'Jun', volume: 8400, trades: 25 },
  ];

  const corridorData = [
    { country: 'Nigeria', products: 'Cocoa, Cashew', volume: '₦2.4B', growth: '+12%' },
    { country: 'Ghana', products: 'Cocoa, Gold', volume: '₦1.8B', growth: '+8%' },
    { country: 'Ivory Coast', products: 'Cocoa', volume: '₦3.1B', growth: '+15%' },
    { country: 'Kenya', products: 'Tea, Coffee', volume: '₦1.2B', growth: '+5%' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight text-white lg:text-5xl">Intelligence</h1>
          <p className="mt-2 text-white/50">Tracking cross-border agricultural trade volumes and corridor health.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-(--color-mint) px-4 py-2 text-xs font-bold uppercase tracking-widest text-(--color-ink) transition-all">
            Download Report
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card variant="glass" className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display text-xl uppercase tracking-wider text-white">Trade Volume Analysis</h3>
            <Badge variant="mint">Live Data</Badge>
          </div>
          <div className="h-80 w-full overflow-hidden">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tradeData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-mint)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-mint)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#05180c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }}
                    itemStyle={{ color: 'var(--color-mint)' }}
                  />
                  <Area type="monotone" dataKey="volume" stroke="var(--color-mint)" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </Card>

        <Card variant="solid" className="flex flex-col justify-between">
           <div>
              <div className="h-12 w-12 rounded-2xl bg-(--color-gold)/10 flex items-center justify-center text-(--color-gold) mb-6">
                 <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl uppercase leading-tight text-white">Market Dominance</h3>
              <p className="text-xs text-white/40 mt-2">West African corridors account for 68% of total network volume.</p>
           </div>
           <div className="space-y-4">
              <div className="space-y-1">
                 <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <span>West Africa</span>
                    <span>68%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-(--color-mint) w-[68%]" />
                 </div>
              </div>
              <div className="space-y-1">
                 <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <span>East Africa</span>
                    <span>22%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-(--color-gold) w-[22%]" />
                 </div>
              </div>
           </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="solid">
           <h3 className="font-display text-xl uppercase tracking-wider text-white mb-8">Active Corridors</h3>
           <div className="space-y-4">
              {corridorData.map((corridor) => (
                <div key={corridor.country} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                      <MapIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-wide">{corridor.country}</p>
                      <p className="text-[10px] text-white/40">{corridor.products}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{corridor.volume}</p>
                    <p className="text-[10px] text-(--color-mint) font-bold uppercase tracking-widest">{corridor.growth}</p>
                  </div>
                </div>
              ))}
           </div>
        </Card>

        <Card variant="glass" className="bg-gradient-to-br from-(--color-mint)/10 to-transparent flex flex-col items-center justify-center text-center p-10">
           <TrendingUp className="h-16 w-16 text-(--color-mint) mb-8" />
           <h2 className="font-display text-4xl uppercase leading-tight text-white mb-4">Trade Index<br />Forecast</h2>
           <p className="text-sm text-white/50 leading-relaxed max-w-sm mb-8">
             AI predictive models suggest a 24% increase in cashew export volume across the Nigeria-Benin border for Q3 2026.
           </p>
           <Button variant="mint" className="gap-2">
             View Full Market Report <ArrowUpRight className="h-4 w-4" />
           </Button>
        </Card>
      </div>
    </div>
  );
}
