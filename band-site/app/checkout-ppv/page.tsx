'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import Link from 'next/link';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const startCheckout = async () => {
      const sessionId = searchParams.get('sessionId') || localStorage.getItem('kam_oracle_session');
      const item = searchParams.get('item') || 'VIP_PASS';

      if (!sessionId) {
        setError('No active session found.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/myriam-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item, sessionId })
        });
        
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError(data.error || 'Failed to initialize secure connection.');
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError('Connection failed. Please try again.');
        setLoading(false);
      }
    };

    startCheckout();
  }, [searchParams]);

  if (error) {
    return (
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-500">Signal Disrupted</h1>
        <p className="mb-6 text-stone-400">{error}</p>
        <Link href="/myriam" className="text-[#f4c66a] hover:underline">Return to Oracle</Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <Lock className="mx-auto mb-6 h-12 w-12 animate-pulse text-[#f4c66a]" />
      <h1 className="mb-4 font-display text-3xl uppercase tracking-[0.1em] text-stone-100">Securing Artifact</h1>
      <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Establishing encrypted connection to payment gateway...</p>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050403] p-4">
      <div className="w-full max-w-md border border-[#f4a33f]/30 bg-black/80 p-8 shadow-[0_30px_100px_rgba(201,82,16,0.15)]">
        <Suspense fallback={<div className="text-center text-stone-500">Loading...</div>}>
          <CheckoutContent />
        </Suspense>
      </div>
    </div>
  );
}
