import React, { useState, useMemo, useRef, useEffect } from 'react';
import { History, X, ExternalLink, Activity, BarChart2 } from 'lucide-react';
import { useAuditHistory, AuditResult } from '../lib/useAuditHistory';

export function AuditHistory() {
  const { history, clearHistory } = useAuditHistory();
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const groupedHistory = useMemo(() => {
    const groups: Record<string, AuditResult[]> = {};
    history.forEach(item => {
      if (!groups[item.url]) groups[item.url] = [];
      groups[item.url].push(item);
    });
    return Object.entries(groups).map(([url, audits]) => {
      // audits are already sorted newest first because they were unshifted
      return {
        url,
        latest: audits[0],
        trend: [...audits].reverse() // chronological order for trend line
      };
    });
  }, [history]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      setTimeout(() => {
        const firstElem = scrollRef.current?.querySelector('[tabindex="0"]') as HTMLElement | null;
        if (firstElem) firstElem.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent, targetUrl: string) => {
    const current = document.activeElement as HTMLElement;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = current.nextElementSibling as HTMLElement;
      if (next?.tabIndex === 0) next.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = current.previousElementSibling as HTMLElement;
      if (prev?.tabIndex === 0) prev.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      window.open(targetUrl, '_blank');
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (history.length === 0) return null;

  return (
    <>
      {/* Toggler */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-[var(--color-brand-charcoal-light)] border border-white/10 hover:border-white/30 rounded-full shadow-2xl transition-all group"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-red)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--color-brand-red)] border-2 border-black"></span>
        </span>
        <History className="w-6 h-6 text-white group-hover:text-[var(--color-brand-red)] transition-colors" />
      </button>

      {/* Panel */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-[var(--color-brand-bg)] border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-[100%]'}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10 glass-nav">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--color-brand-red)]" />
            Session History
          </h3>
          <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {groupedHistory.map((group, i) => {
            const { url, latest, trend } = group;
            return (
            <div 
              key={url} 
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, url)}
              className="p-4 bg-[var(--color-brand-charcoal-light)] rounded-xl border border-white/5 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent transition-all"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${latest.score > 80 ? 'bg-[var(--color-brand-green)]' : latest.score > 50 ? 'bg-yellow-500' : 'bg-[var(--color-brand-red)]'}`} />
              
              <div className="flex justify-between items-start mb-3 ml-2">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white hover:text-[var(--color-brand-red)] transition-colors truncate max-w-[200px] flex items-center gap-1"
                >
                  {url.replace('https://', '')}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <span className={`font-mono font-bold ${latest.score > 80 ? 'text-[var(--color-brand-green)]' : latest.score > 50 ? 'text-yellow-500' : 'text-[var(--color-brand-red)]'}`}>
                  {latest.score}
                </span>
              </div>
              
              <div className="ml-2 flex justify-between items-end gap-2 text-xs font-mono text-gray-500">
                <div className="space-y-1">
                  <div>TTFB: {latest.metrics?.ttfb || '--'}ms</div>
                  <div>Load: {( (latest.metrics?.loadTime || 0) / 1000).toFixed(1)}s</div>
                </div>
                
                {trend.length > 1 && (
                  <div className="flex items-end gap-[2px] h-8 opacity-70 group-hover:opacity-100 transition-opacity pb-1">
                     {trend.slice(-15).map((entry, idx) => (
                        <div 
                          key={idx} 
                          title={`Score: ${entry.score}`}
                          className={`w-1 rounded-sm ${entry.score > 80 ? 'bg-[var(--color-brand-green)]' : entry.score > 50 ? 'bg-yellow-500' : 'bg-[var(--color-brand-red)]'}`}
                          style={{ height: `${entry.score}%` }}
                        />
                     ))}
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-white/10 bg-[var(--color-brand-charcoal)]">
          <button 
            onClick={clearHistory}
            className="w-full py-3 text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
          >
            Clear History
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
