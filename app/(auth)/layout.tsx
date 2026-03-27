import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-(--color-forest)">
      {/* Brand Panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-(--color-ink) p-12 lg:flex">
        <div className="font-display text-2xl uppercase tracking-[0.2em] text-(--color-mint)">
          AgroChain AI
        </div>
        
        <div className="space-y-6">
          <h1 className="font-display text-6xl uppercase leading-[0.9] tracking-tighter text-white">
            Secure Trade<br />Infrastructure
          </h1>
          <p className="max-w-md text-lg text-white/50">
            Building trust, intelligence, and financial identity for Africa's agricultural trade corridors.
          </p>
        </div>

        <div className="flex gap-8 text-xs uppercase tracking-widest text-white/30">
          <span>Escrow Protected</span>
          <span>Blockchain Verified</span>
          <span>AI Powered</span>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md space-y-8 animate-in">
          <div className="lg:hidden text-center mb-12">
            <span className="font-display text-xl uppercase tracking-[0.2em] text-(--color-mint)">
              AgroChain AI
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
