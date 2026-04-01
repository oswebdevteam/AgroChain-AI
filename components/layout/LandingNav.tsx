"use client";

import React, { useState } from "react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Impact", href: "#impact" },
  { label: "Team", href: "#team" },
];

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[color-mix(in_srgb,var(--color-forest)_88%,black)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-10">
        {/* Logo */}
        <a
          href="/"
          className="font-display text-base uppercase tracking-[0.16em] text-(--color-mint) sm:text-xl whitespace-nowrap"
        >
          AgroChain AI
        </a>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 text-sm text-white/72 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition hover:text-(--color-cream)"
            >
              {item.label}
            </a>
          ))}
          <a href="/login" className="transition hover:text-(--color-mint)">
            Login
          </a>
        </div>

        {/* Right side: CTA + hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-(--color-mint) px-4 py-2.5 text-sm font-semibold text-(--color-ink) transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(46,204,113,0.28)] sm:px-5 sm:py-3"
          >
            <span className="hidden sm:inline">Launch App</span>
            <span className="sm:hidden">App</span>
            <ArrowUpRight />
          </a>

          {/* Hamburger – mobile only */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all md:hidden"
          >
            {open ? (
              /* X icon */
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="border-t border-white/10 bg-[color-mix(in_srgb,var(--color-forest)_95%,black)] px-5 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-(--color-mint)"
            >
              Login
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
