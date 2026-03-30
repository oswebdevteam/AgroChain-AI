"use client";

import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { Profile } from '@/types';
import { Search, Loader2, Check, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FarmerSelectProps {
  value: string;
  onChange: (id: string) => void;
  error?: string;
}

export function FarmerSelect({ value, onChange, error }: FarmerSelectProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Profile | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initial fetch if value is provided
  useEffect(() => {
    if (value && !selectedFarmer) {
      const fetchInitial = async () => {
        try {
          const { data } = await api.get(`/auth/sellers?q=${value}`);
          const found = (data.data as Profile[]).find((p) => p.id === value);
          if (found) {
            setSelectedFarmer(found);
            setQuery(found.full_name || found.email);
          }
        } catch (err) {
          console.error('Failed to fetch initial farmer', err);
        }
      };
      fetchInitial();
    }
  }, [value, selectedFarmer]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2 && isOpen) {
        setLoading(true);
        try {
          const { data } = await api.get(`/auth/sellers?q=${query}`);
          setResults(data.data || []);
        } catch (err) {
          console.error('Search failed', err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (farmer: Profile) => {
    setSelectedFarmer(farmer);
    setQuery(farmer.full_name || farmer.email);
    onChange(farmer.id);
    setIsOpen(false);
  };

  return (
    <div className="flex w-full flex-col gap-2" ref={dropdownRef}>
      <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
        Select Farmer (Seller)
      </label>
      <div className="relative w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </div>
        <input
          type="text"
          className={cn(
            'flex h-12 w-full rounded-2xl border border-white/10 bg-(--color-forest) pl-11 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:border-(--color-mint) focus:outline-none focus:ring-1 focus:ring-(--color-mint) transition-all duration-200',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
          )}
          placeholder="Search by name, email, or ID..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (selectedFarmer && e.target.value !== selectedFarmer.full_name) {
              setSelectedFarmer(null);
              onChange('');
            }
          }}
          onFocus={() => setIsOpen(true)}
        />

        {isOpen && (query.length >= 2 || results.length > 0) && (
          <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl border border-white/10 bg-(--color-forest) shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
            {loading && results.length === 0 ? (
              <div className="p-4 text-center text-sm text-white/40">Searching...</div>
            ) : results.length > 0 ? (
              results.map((farmer) => (
                <button
                  key={farmer.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm transition-colors hover:bg-white/5",
                    selectedFarmer?.id === farmer.id && "bg-white/10"
                  )}
                  onClick={() => handleSelect(farmer)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-mint)/10 text-(--color-mint)">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-white truncate">{farmer.full_name || 'Anonymous Farmer'}</p>
                    <p className="text-xs text-white/40 truncate">{farmer.email}</p>
                  </div>
                  {selectedFarmer?.id === farmer.id && <Check className="h-4 w-4 text-(--color-mint)" />}
                </button>
              ))
            ) : !loading && query.length >= 2 ? (
              <div className="p-4 text-center text-sm text-white/40">No farmers found.</div>
            ) : null}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {selectedFarmer && (
        <p className="mt-1 text-[10px] text-white/30 font-mono uppercase tracking-tighter">
          ID: {selectedFarmer.id}
        </p>
      )}
    </div>
  );
}
