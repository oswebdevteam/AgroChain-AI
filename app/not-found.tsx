"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--color-forest) p-6 text-center">
      <h1 className="font-display text-9xl text-white/10">404</h1>
      <div className="-mt-12 space-y-4">
        <h2 className="font-display text-4xl uppercase tracking-tighter text-white">Lost in the Fields?</h2>
        <p className="mx-auto max-w-md text-white/50">
          The page you are looking for doesn&apos;t exist or has been moved to another corridor.
        </p>
        <div className="pt-8">
          <Button asChild variant="mint">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
