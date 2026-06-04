import React, { useState, useMemo, useRef, useEffect } from 'react';
import { History, X, ExternalLink, Activity, BarChart2, Search } from 'lucide-react';
import { useAuditHistory, AuditResult } from '../lib/useAuditHistory';

export function AuditHistory() {
  const { history, clearHistory } = useAuditHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const scrollRef = useRef<HTMLDivElement>(null);

  const groupedHistory = useMemo(() => {
    const groups: Record<string, AuditResult[]> = {};
    history.forEach(item => {
      if (!groups[item.url]) groups[item.url] = [];
      groups[item.url].push(item);
    });
    
    let entries = Object.entries(groups).map(([url, audits]) => {
      // audits are already sorted newest first because they were unshifted
      return {
        url,
        latest: audits[0],
        trend: [...audits].reverse() // chronological order for trend line
      };
    });

    if (filterQuery.trim() !== '') {
      const q = filterQuery.toLowerCase();
      entries = entries.filter(e => e.url.toLowerCase().includes(q));
    }

    if (filterCategory !== 'All') {
      entries = entries.filter(e => {
        const { score, metrics } = e.latest;
        switch (filterCategory) {
          case 'High Score': return score >= 80;
          case 'Needs Work': return score < 80;
          case 'Security Issues': return metrics && metrics.securityScore && metrics.securityScore < 20;
          case 'Slow': return metrics && metrics.loadTime && metrics.loadTime > 1500;
          default: return true;
        }
      });
    }

    return entries;
  }, [history, filterQuery, filterCategory]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      setTimeout(() => {
        const firstElem = scrollRef.current?.querySelector('[tabindex="0"]') as HTMLElement | null;
        if (firstElem) firstElem.focus();
      }, 100);
    } else {
      if (!isOpen) { // Reset filter when closing
        setTimeout(() => {
          setFilterQuery('');
          setFilterCategory('All');
        }, 300);
      }
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
        className="fixed bottom-6 right-6 z-50 p-4 bg-[var(--color-brand-charcoal-light)] border border-[var(--color-brand-border-strong)] hover:border-[var(--color-brand-red)] rounded-full shadow-2xl transition-all group"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-red)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--color-brand-red)] border-2 border-[var(--color-brand-bg)]"></span>
        </span>
        <History className="w-6 h-6 text-[var(--color-brand-text)] group-hover:text-[var(--color-brand-red)] transition-colors" />
      </button>

      {/* Panel */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-[var(--color-brand-bg)] border-l border-[var(--color-brand-border-strong)] z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-[100%]'}`}>
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-brand-border)] glass-nav">
          <h3 className="text-lg font-bold text-[var(--color-brand-text)] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--color-brand-red)]" />
            Session History
          </h3>
          <button onClick={() => setIsOpen(false)} className="p-2 text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)] rounded-lg hover:bg-[var(--color-brand-charcoal)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-[var(--color-brand-border)] flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-brand-muted)]" />
            <input 
              type="text" 
              placeholder="Search by domain..." 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border-strong)] text-[var(--color-brand-text)] rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[var(--color-brand-red)] font-mono text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'High Score', 'Needs Work', 'Security Issues', 'Slow'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 text-xs font-mono rounded-full border transition-colors ${filterCategory === cat ? 'bg-[var(--color-brand-red)] text-white border-[var(--color-brand-red)]' : 'bg-transparent text-[var(--color-brand-muted)] border-[var(--color-brand-border-strong)] hover:border-[var(--color-brand-text)]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {groupedHistory.length === 0 ? (
            <div className="text-center text-[var(--color-brand-muted)] font-mono text-sm pt-8">
              No audits found matching '{filterQuery}'
            </div>
          ) : (
            groupedHistory.map((group, i) => {
              const { url, latest, trend } = group;
              return (
              <div 
                key={url} 
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, url)}
                className="p-4 bg-[var(--color-brand-charcoal-light)] rounded-xl border border-[var(--color-brand-border-strong)] relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] focus:border-transparent transition-all"
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${latest.score > 80 ? 'bg-[var(--color-brand-green)]' : latest.score > 50 ? 'bg-yellow-500' : 'bg-[var(--color-brand-red)]'}`} />
                
                <div className="flex justify-between items-start mb-3 ml-2">
                  <div className="flex flex-col">
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[var(--color-brand-text)] hover:text-[var(--color-brand-red)] transition-colors truncate max-w-[180px] flex items-center gap-1"
                    >
                      {url.replace('https://', '')}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const shareUrl = `${window.location.origin}/${url.replace(/^https?:\/\//, '')}`;
                        navigator.clipboard.writeText(shareUrl);
                        // Using visual feedback
                        const btn = e.currentTarget;
                        const originalHtml = btn.innerHTML;
                        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--color-brand-green)]"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                        setTimeout(() => btn.innerHTML = originalHtml, 2000);
                      }}
                      className="text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)] transition-colors p-1 opacity-0 group-hover:opacity-100"
                      title="Copy sharing link"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </button>
                    <span className={`font-mono font-bold ${latest.score > 80 ? 'text-[var(--color-brand-green)]' : latest.score > 50 ? 'text-yellow-500' : 'text-[var(--color-brand-red)]'}`}>
                      {latest.score}
                    </span>
                  </div>
                </div>
                
                <div className="ml-2 flex justify-between items-end gap-2 text-xs font-mono text-[var(--color-brand-muted)]">
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
            })
          )}
        </div>

        <div className="p-6 border-t border-[var(--color-brand-border)] bg-[var(--color-brand-charcoal)]">
          <button 
            onClick={clearHistory}
            className="w-full py-3 text-sm font-medium text-[var(--color-brand-muted)] hover:text-[var(--color-brand-text)] bg-[var(--color-brand-charcoal-light)] hover:bg-[var(--color-brand-bg)] rounded-lg transition-colors border border-[var(--color-brand-border-strong)]"
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
