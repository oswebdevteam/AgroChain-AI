"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Leaf, 
  Wallet, 
  ShieldCheck, 
  BarChart3, 
  UserCircle,
  LogOut,
  PlusCircle,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', href: '/orders', icon: ShoppingCart },
    { label: 'Payments', href: '/payments', icon: Wallet },
    { label: 'Financial Identity', href: '/identity', icon: ShieldCheck },
  ];

  if (user?.role === UserRole.BUYER) {
    navLinks.splice(2, 0, { label: 'New Order', href: '/orders/new', icon: PlusCircle });
  }

  const adminLinks = [
    { label: 'Trade Corridor', href: '/analytics', icon: BarChart3 },
    { label: 'Blockchain Wallet', href: '/blockchain/wallet', icon: Database },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="sidebar-blur hidden flex-col border-r border-white/10 lg:flex h-full">
      <div className="p-8">
        <Link href="/" className="font-display text-xl uppercase tracking-[0.2em] text-(--color-mint)">
          AgroChain AI
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-4 mb-4">
          Menu
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
              isActive(link.href)
                ? 'bg-(--color-mint) text-(--color-ink)'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            )}
          >
            <link.icon className={cn('h-5 w-5', isActive(link.href) ? 'text-(--color-ink)' : 'text-white/30 group-hover:text-white')} />
            {link.label}
          </Link>
        ))}

        {user?.role === UserRole.ADMIN && (
          <>
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-4 mt-8 mb-4">
              Intelligence
            </div>
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive(link.href)
                    ? 'bg-(--color-gold) text-(--color-forest)'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                )}
              >
                <link.icon className={cn('h-5 w-5', isActive(link.href) ? 'text-(--color-forest)' : 'text-white/30 group-hover:text-white')} />
                {link.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="border-t border-white/10 p-4 space-y-2">
        <Link
          href="/profile"
          className={cn(
            'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
            isActive('/profile') ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5'
          )}
        >
          <UserCircle className="h-5 w-5" />
          Profile
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
