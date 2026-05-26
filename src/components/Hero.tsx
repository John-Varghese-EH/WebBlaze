import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Terminal } from 'lucide-react';
import { useAuditHistory, AuditResult } from '../lib/useAuditHistory';
import { AuditReport } from './AuditReport';

export function Hero() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [lastResult, setLastResult] = useState<AuditResult | null>(null);
  const { addAudit } = useAuditHistory();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if there's a URL in the pathname (e.g. /google.com)
    const pathUrl = window.location.pathname.replace(/^\/+/, '');
    if (pathUrl && pathUrl.includes('.') && pathUrl !== 'index.html') {
      setUrl(pathUrl);
      setTimeout(() => {
        handleScanInternal(pathUrl);
      }, 500); // Small delay to let component mount smoothly
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScanInternal = async (targetUrl: string) => {
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingText('Connecting to server...');
    setLastResult(null);

    const steps = [
      { progress: 15, text: 'Fetching HTML...' },
      { progress: 35, text: 'Analyzing Meta Tags...' },
      { progress: 55, text: 'Checking Performance...' },
      { progress: 75, text: 'Querying AI Readability...' },
      { progress: 90, text: 'Synthesizing Report...' }
    ];
    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setLoadingProgress(steps[currentStep].progress);
        setLoadingText(steps[currentStep].text);
        currentStep++;
      }
    }, 600);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data: AuditResult = await response.json();
      
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setLoadingText('Audit Complete!');
      
      setLastResult(data);
      addAudit(data);
      
      // Auto-scroll to results
      setTimeout(() => {
        document.getElementById('audit-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);

    } catch (error) {
      console.error(error);
      clearInterval(progressInterval);
      setLoadingText('Audit failed.');
      alert('Analysis failed. WebBlaze might be encountering CORS or unreachable target. Check console logs.');
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    // Update URL bar without reloading to shareable link
    window.history.pushState({}, '', `/${url.replace(/^https?:\/\//, '')}`);
    
    handleScanInternal(url);
  };

  return (
    <section id="hero" className="relative pt-40 pb-20 px-6 min-h-[85vh] flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-brand-red)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10 w-full flex flex-col items-center mt-12 md:mt-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-[var(--color-brand-red)]/30 text-sm font-mono text-[var(--color-brand-red)] mb-4 shadow-[0_0_15px_rgba(248,81,73,0.2)]">
          <Terminal className="w-4 h-4 animate-pulse" />
          <span>Lighthouse Alternative - No BS Analytics</span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-[0.95] text-center w-full uppercase">
          Ready to be <br className="hidden md:block" />
          <span className="text-gradient">Roasted?</span>
          <span className="animate-blink font-mono text-[var(--color-brand-red)] -ml-2 lg:-ml-6">_</span>
        </h1>

        <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-400 font-medium leading-relaxed mt-8 bg-black/40 backdrop-blur-sm p-4 border-l-4 border-[var(--color-brand-red)] rounded-r-lg text-left">
          Ready to turn your site into burning embers? We strip away the marketing fluff to expose the brutal truth about your web performance, security, and TTFB. No sugarcoating, just raw data.
        </p>

        <form onSubmit={handleScan} className="max-w-4xl mx-auto mt-16 w-full relative z-20">
          <div className="relative flex flex-col sm:flex-row gap-3 p-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-[var(--color-brand-red)]/20 focus-within:border-[var(--color-brand-red)]/60 transition-all shadow-[0_0_40px_rgba(248,81,73,0.15)] group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-brand-red)]/5 to-transparent flex-1 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <input
              ref={inputRef}
              type="text"
              placeholder="yoursite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value.toLowerCase())}
              required
              className="flex-1 bg-transparent px-4 py-4 md:px-8 text-xl text-[var(--color-brand-text)] font-mono placeholder:text-gray-500 focus:outline-none relative z-10"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`relative overflow-hidden group min-w-[200px] px-6 py-4 md:px-8 bg-[var(--color-brand-red)] hover:bg-[#ff6b6b] text-white font-black uppercase text-lg tracking-wider rounded-xl transition-all disabled:opacity-80 flex items-center justify-center gap-2 ${isLoading ? 'btn-fire-loading text-shadow-sm scale-[0.98]' : 'hover:scale-[1.02]'}`}
            >
              <span className="relative z-10 flex items-center gap-2 font-mono drop-shadow-md">
                {isLoading ? 'Igniting...' : 'Run Audit'}
                {!isLoading && <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />}
              </span>
            </button>

            {/* Loading Progress Bar inside input box */}
            {isLoading && (
              <div className="absolute bottom-0 left-0 h-1 bg-[var(--color-brand-red)] transition-all duration-300 pointer-events-none" style={{ width: `${loadingProgress}%` }} />
            )}
          </div>
          
          {/* Loading Text */}
          {isLoading ? (
            <div className="mt-6 text-sm font-mono text-[var(--color-brand-red)] uppercase flex justify-center items-center gap-3 tracking-widest bg-[var(--color-brand-red)]/10 px-4 py-2 rounded-full w-max mx-auto shadow-[0_0_15px_rgba(248,81,73,0.2)]">
              <Terminal className="w-4 h-4 animate-spin" />
              <span>{loadingText || 'Analyzing...'}</span>
            </div>
          ) : (
            <div className="mt-8 text-sm font-mono text-[var(--color-brand-muted)] uppercase flex gap-6 justify-center tracking-widest items-center opacity-70">
              <span>Press <kbd className="px-2 py-1 bg-white/5 rounded mx-1 border border-white/10 text-[var(--color-brand-text)] font-bold tracking-tight">⌘</kbd> + <kbd className="px-2 py-1 bg-white/5 rounded mx-1 border border-white/10 text-[var(--color-brand-text)] font-bold tracking-tight">K</kbd> to focus</span>
              <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-brand-red)] animate-pulse" />
              <span className="hidden md:inline-block">Instant Results</span>
            </div>
          )}
        </form>

        <AuditReport result={lastResult} isLoading={isLoading} />
      </div>
    </section>
  );
}
