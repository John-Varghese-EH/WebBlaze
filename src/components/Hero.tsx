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

  const [compareResultState, setCompareResultState] = useState<AuditResult | null>(null);

  useEffect(() => {
    const pathUrl = window.location.pathname.replace(/^\/+/, '');
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');

    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(dataParam)));
        if (decoded.result) {
          setUrl(decoded.result.url);
          setLastResult(decoded.result);
        }
        if (decoded.compareResult) {
          setCompareResultState(decoded.compareResult);
        }
      } catch (e) {
        console.error('Failed to parse data param', e);
      }
    } else if (pathUrl && pathUrl.includes('.') && pathUrl !== 'index.html' && pathUrl !== 'checklist') {
      setUrl(pathUrl);
      setTimeout(() => {
        handleScanInternal(pathUrl);
      }, 500);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (inputRef.current && inputRef.current.value) {
          e.preventDefault();
          inputRef.current.form?.requestSubmit();
        }
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
        if (response.status === 404) {
          throw new Error('API route not found (/api/audit). If you deployed to Vercel, ensure your Express backend is configured as a serverless function via vercel.json.');
        }
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

    } catch (error: any) {
      console.error(error);
      clearInterval(progressInterval);
      setLoadingText('Audit failed.');
      alert(error.message || 'Analysis failed. WebBlaze might be encountering CORS or unreachable target. Check console logs.');
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
    <section id="hero" className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 min-h-[auto] md:min-h-[85vh] flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Background flare & Grid effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[var(--color-brand-red)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 relative z-10 w-full flex flex-col items-center mt-8 md:mt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full font-mono text-xs uppercase tracking-widest font-black shadow-[0_0_15px_rgba(248,81,73,0.2)] mb-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          System Protocol Active
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 leading-[0.85] text-center w-full uppercase drop-shadow-2xl">
          Ignite Your <br className="hidden md:block" />
          <span className="text-[var(--color-brand-red)] bg-none drop-shadow-[0_0_25px_rgba(248,81,73,0.8)] filter">Web Stack</span>
          <span className="animate-blink font-mono text-[var(--color-brand-red)] -ml-2 lg:-ml-6 inline-block opacity-80">_</span>
        </h1>

        <p className="max-w-3xl mx-auto text-lg md:text-xl text-[var(--color-brand-muted)] font-mono leading-relaxed mt-10 bg-[var(--color-brand-charcoal-light)]/40 backdrop-blur-md p-6 border-l-4 border-r-4 border-[var(--color-brand-red)] rounded flex items-center justify-center text-center shadow-[0_0_40px_rgba(0,0,0,0.8)] relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[var(--color-brand-red)] -ml-[3px] -mt-[3px]"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[var(--color-brand-red)] -mr-[3px] -mb-[3px]"></div>
          Strip away the marketing fluff to expose the brutal truth about your web performance, security, and AI visibility. No sugarcoating, just raw telemetry data.
        </p>

        <form onSubmit={handleScan} className="max-w-4xl mx-auto mt-14 md:mt-20 w-full relative z-20 px-4 md:px-0">
          <div className="relative flex flex-col sm:flex-row gap-0 bg-[var(--color-brand-charcoal-light)]/80 backdrop-blur-2xl rounded-xl border border-[var(--color-brand-border-strong)] focus-within:border-[var(--color-brand-red)]/80 focus-within:ring-4 focus-within:ring-[var(--color-brand-red)]/20 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] group overflow-hidden">
            
            <div className="px-6 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-[var(--color-brand-border-strong)] bg-black/40 text-[var(--color-brand-muted)] font-mono text-sm tracking-widest uppercase">
              Target_URL
            </div>

            <input
              ref={inputRef}
              type="text"
              placeholder="e.g. yoursite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value.toLowerCase())}
              required
              className="flex-1 bg-transparent px-4 py-5 md:px-6 text-xl text-white font-mono placeholder:text-gray-600 focus:outline-none relative z-10"
            />
            
            <button
              type="submit"
              disabled={isLoading}
              className={`relative overflow-hidden group min-w-[220px] px-6 py-5 bg-[var(--color-brand-red)] hover:bg-[#eb4b4b] text-white font-black uppercase text-lg tracking-widest transition-all disabled:opacity-80 flex items-center justify-center gap-3 ${isLoading ? 'btn-fire-loading text-shadow-sm scale-[0.98]' : 'hover:scale-[#eb4b4b] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.2)]'}`}
            >
              <span className="relative z-10 flex items-center gap-2 font-mono drop-shadow-md">
                {isLoading ? 'Igniting...' : 'Run Audit'}
                {!isLoading && <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />}
              </span>
            </button>

            {/* Loading Progress Bar inside input box */}
            {isLoading && (
              <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-red-600 to-yellow-500 transition-all duration-300 pointer-events-none shadow-[0_0_10px_rgba(248,81,73,0.8)]" style={{ width: `${loadingProgress}%` }} />
            )}
          </div>
          
          {/* Loading Text */}
          {isLoading ? (
            <div className="mt-8 text-xs md:text-sm font-mono text-yellow-500 uppercase flex justify-center items-center gap-3 tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-6 py-2.5 rounded w-max mx-auto shadow-md">
              <Terminal className="w-4 h-4 animate-pulse relative -top-0.5" />
              <span>{loadingText || 'Analyzing...'}</span>
            </div>
          ) : (
            <div className="mt-6 text-xs md:text-sm font-mono text-[var(--color-brand-muted)] uppercase flex gap-4 md:gap-6 justify-center tracking-widest items-center opacity-70 flex-wrap">
              <span className="flex items-center gap-2">Press <kbd className="px-2 py-1 bg-black rounded shadow-[inset_0_-2px_0_rgba(255,255,255,0.2)] border border-[var(--color-brand-border-strong)] text-[var(--color-brand-text)] font-bold tracking-tight">⌘</kbd> + <kbd className="px-2 py-1 bg-black shadow-[inset_0_-2px_0_rgba(255,255,255,0.2)] rounded border border-[var(--color-brand-border-strong)] text-[var(--color-brand-text)] font-bold tracking-tight">K</kbd> to focus</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-red)] shadow-[0_0_8px_rgba(248,81,73,1)]" />
              <span>Instant Readout</span>
            </div>
          )}
        </form>

        <AuditReport result={lastResult} isLoading={isLoading} initialCompareResult={compareResultState} />
      </div>
    </section>
  );
}
