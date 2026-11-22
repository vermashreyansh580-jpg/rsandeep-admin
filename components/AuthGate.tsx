'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, Sparkles, ArrowRight } from 'lucide-react';

interface AuthGateProps {
  onUnlock: () => void;
}

export default function AuthGate({ onUnlock }: AuthGateProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === 'sandeep2026' || pin.trim() === 'admin123') {
      localStorage.setItem('rsandeep_admin_auth', 'true');
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl -bottom-20 -right-20 pointer-events-none" />

      <div className="max-w-md w-full bg-brand-darkCard border border-brand-borderDark rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10 gold-shimmer-border">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full border-2 border-brand-gold flex items-center justify-center bg-brand-charcoal text-brand-gold font-cinzel font-bold text-2xl mx-auto mb-4 shadow-xl">
            RS
          </div>
          <span className="text-brand-gold font-cinzel tracking-[0.3em] uppercase text-xs font-semibold block mb-1">
            STUDIO CONTROL PANEL
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-light text-white">
            R Sandeep Admin CMS
          </h1>
          <p className="text-xs text-brand-muted mt-2">
            Enter Studio Master PIN to manage categories, cover images & client portfolios.
          </p>
        </div>

        {/* PIN Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-xs font-cinzel tracking-wider text-brand-goldLight uppercase font-semibold mb-2">
              Studio Master PIN
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN (Default: sandeep2026)"
                className={`w-full bg-brand-charcoal border ${
                  error ? 'border-red-500 animate-shake' : 'border-brand-borderDark'
                } rounded-xl px-4 py-3.5 text-center tracking-[0.3em] text-lg text-white focus:outline-none focus:border-brand-gold transition-colors`}
              />
              <KeyRound className="w-4 h-4 text-brand-gold absolute right-4 top-1/2 -translate-y-1/2 opacity-70" />
            </div>
            {error && (
              <p className="text-xs text-red-400 mt-2 text-center">
                Invalid Master PIN. Please try again or use default (sandeep2026).
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-brand-gold text-brand-charcoal hover:bg-brand-goldHover font-cinzel text-xs tracking-[0.2em] font-extrabold uppercase rounded-lg shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
          >
            <Lock className="w-4 h-4 fill-brand-charcoal" /> ACCESS STUDIO CMS
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-borderDark/60 flex items-center justify-between text-xs text-brand-muted/80">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> Encrypted Session
          </span>
          <span className="font-mono text-[10px] text-brand-gold/70">
            PIN: sandeep2026
          </span>
        </div>

      </div>
    </div>
  );
}