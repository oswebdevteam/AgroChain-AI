"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
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
  Database,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { user, logout } = useAuth();
  const { isOpen, close } = useSidebar();
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

  const sidebarContent = (
    <aside className="sidebar-blur flex flex-col border-r border-white/10 h-full w-72">
      <div className="flex items-center justify-between p-8">
        <Link href="/" className="font-display text-xl uppercase tracking-[0.2em] text-(--color-mint)">
          AgroChain AI
        </Link>
        {/* Close button only visible on mobile */}
        <button
          onClick={close}
          className="lg:hidden rounded-xl border border-white/10 bg-white/5 p-1.5 text-white hover:bg-white/10 transition-all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-4 mb-4">
          Menu
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={close}
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
                onClick={close}
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
          onClick={close}
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

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full">
        {sidebarContent}
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full bg-(--color-forest) shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
