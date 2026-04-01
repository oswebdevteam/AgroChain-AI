"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { User, Mail, Phone, Shield, MapPin, Globe } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 w-full max-w-4xl">
      <header>
        <h1 className="font-display text-3xl uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
          Account Settings
        </h1>
        <p className="mt-2 text-sm text-white/50">Manage your profile and protocol preferences.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info – full width on mobile, 2/3 on desktop */}
        <Card variant="glass" className="lg:col-span-2 space-y-6">
          {/* Avatar row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-(--color-mint) font-display text-3xl text-(--color-ink) sm:h-24 sm:w-24 sm:text-4xl">
              {(user?.full_name || 'U').charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-white sm:text-2xl">{user?.full_name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="mint" className="uppercase tracking-widest text-[10px]">
                  Verified {user?.role}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-white/30 min-w-0">
                  <Shield className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">AgroChain Identity ID: ...{user?.id.slice(-8)}</span>
                </div>
              </div>
            </div>
          </div>

          <form className="space-y-5 pt-5 border-t border-white/5">
            {/* Stack on mobile, 2-col on sm+ */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Full Name"
                defaultValue={user?.full_name || ''}
                icon={<User className="h-4 w-4" />}
              />
              <Input
                label="Email Address"
                defaultValue={user?.email || ''}
                icon={<Mail className="h-4 w-4" />}
                disabled
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Phone Number"
                defaultValue={user?.phone || ''}
                icon={<Phone className="h-4 w-4" />}
                disabled
              />
              <Input
                label="Primary Trade Currency"
                defaultValue="NGN (₦)"
                icon={<Globe className="h-4 w-4" />}
              />
            </div>
            <Input
              label="Warehouse / Business Address"
              placeholder="Enter your primary logistics address"
              defaultValue=""
              icon={<MapPin className="h-4 w-4" />}
            />

            <div className="pt-2">
              <Button className="w-full sm:w-auto">Update Profile</Button>
            </div>
          </form>
        </Card>

        {/* Security sidebar – stacks below form on mobile, beside on desktop */}
        <div className="space-y-5">
          <Card variant="solid">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-4">Account Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">2FA Status</span>
                <Badge variant="mint">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Recovery Phrase</span>
                <button className="text-[10px] font-bold text-(--color-gold) uppercase tracking-widest hover:underline">
                  Reveal
                </button>
              </div>
              <Button variant="outline" className="w-full text-xs py-2 mt-4">
                Change Password
              </Button>
            </div>
          </Card>

          <Card variant="outline" className="border-red-500/10 bg-red-500/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-red-500/70 mb-2">Danger Zone</h3>
            <p className="text-[10px] text-red-500/40 mb-4 leading-relaxed">
              Deleting your account will permanently wipe your trade history and financial identity.
            </p>
            <button className="text-xs font-bold text-red-500 hover:underline">
              Deactivate Account
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
