import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center relative overflow-hidden px-6 selection:bg-[var(--color-brand-red)] selection:text-white">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-brand-red)]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="text-center z-10 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full font-mono text-xs uppercase tracking-widest font-bold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Page Not Found
        </span>
        
        <div className="text-[clamp(6rem,20vw,10rem)] font-black tracking-tighter leading-none bg-gradient-to-br from-red-500 to-[var(--color-brand-red)] text-transparent bg-clip-text font-mono mb-4 select-none">
          404
        </div>
        
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 text-[var(--color-brand-text)]">
          Oops! This page doesn't exist.
        </h1>
        
        <p className="text-lg text-[var(--color-brand-muted)] mb-10 max-w-lg mx-auto leading-relaxed">
          The page you're looking for may have been moved, renamed, or deleted.
          Or maybe you typed the URL wrong — it happens!
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 bg-[var(--color-brand-text)] text-[var(--color-brand-bg)] font-bold rounded-lg hover:opacity-80 transition-opacity whitespace-nowrap group"
          >
            ← Go Home
          </Link>
          <Link 
            to="/checklist" 
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 bg-[var(--color-brand-bg)] text-[var(--color-brand-text)] border border-[var(--color-brand-border-strong)] rounded-lg hover:bg-[var(--color-brand-charcoal-light)] transition-colors whitespace-nowrap"
          >
            Production Checklist
          </Link>
        </div>
      </div>
    </div>
  );
}
