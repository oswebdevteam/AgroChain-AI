import React from 'react';
import { cn } from '@/lib/utils';

export function CreditScoreCard({ score }: { score: number }) {
  const percentage = score;
  const strokeDasharray = 226; // 2 * PI * 36
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  const getScoreColor = (s: number) => {
    if (s >= 75) return 'var(--color-mint)';
    if (s >= 50) return 'var(--color-gold)';
    return '#f87171';
  };

  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-48 w-48">
        {/* Background circle */}
        <svg className="h-full w-full -rotate-90 transform">
          <circle
            cx="96"
            cy="96"
            r="36"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="36"
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-5xl text-white">{score}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Credit Score</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-[10px] font-bold text-white/30 uppercase">High Risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-(--color-gold)" />
          <span className="text-[10px] font-bold text-white/30 uppercase">Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-(--color-mint)" />
          <span className="text-[10px] font-bold text-white/30 uppercase">Prime</span>
        </div>
      </div>
    </div>
  );
}
