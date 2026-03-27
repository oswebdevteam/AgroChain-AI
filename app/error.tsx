"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <div className="h-20 w-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-8">
        <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="font-display text-3xl uppercase tracking-tight text-white">Something Went Wrong</h2>
      <p className="mt-4 text-white/50 max-w-md mx-auto">
        A protocol error occurred. This could be a temporary connection issue with the trade infrastructure.
      </p>
      <div className="mt-10 flex gap-4">
        <Button onClick={() => reset()} variant="secondary">Try Again</Button>
        <Button variant="ghost" onClick={() => window.location.href = '/dashboard'}>Return Home</Button>
      </div>
    </div>
  );
}
