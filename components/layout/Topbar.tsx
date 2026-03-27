"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function Topbar() {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b border-white/10 bg-(--color-forest)/40 px-6 backdrop-blur lg:px-10">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-4 lg:hidden">
          <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-white">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-sm uppercase tracking-widest text-(--color-mint)">
            AgroChain
          </span>
        </div>

        <div className="hidden lg:block relative w-96">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search trades, orders, or farmers..."
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none focus:border-(--color-mint) transition-all"
          />
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <button className="relative rounded-2xl border border-white/10 bg-white/5 p-2.5 text-white/50 hover:bg-white/10 hover:text-white transition-all">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-(--color-mint) ring-4 ring-[#0d3b1e]" />
          </button>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white">{user?.full_name || 'Agro Trader'}</p>
              <Badge variant="ghost" className="mt-0.5 pointer-events-none">
                {user?.role}
              </Badge>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--color-mint) font-display text-lg text-(--color-ink)">
              {(user?.full_name || 'U').charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
