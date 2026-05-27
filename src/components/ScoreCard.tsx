import { Activity, Flame, ArrowUpRight } from 'lucide-react';
import { CountUp } from './CountUp';

interface ScoreCardProps {
  url: string;
  score: number;
  type: 'top' | 'flop';
  key?: string;
}

export function ScoreCard({ url, score, type }: ScoreCardProps) {
  const isTop = type === 'top';
  const colorClass = isTop ? 'text-[var(--color-brand-green)]' : 'text-[var(--color-brand-red)]';
  const bgClass = isTop ? 'bg-[var(--color-brand-green)]/10' : 'bg-[var(--color-brand-red)]/10';

  return (
    <div className="group relative p-6 bg-[var(--color-brand-charcoal-light)] rounded-2xl border border-[var(--color-brand-border-strong)] hover:border-[var(--color-brand-red)] transition-all flex flex-col justify-between overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 ${isTop ? 'bg-[var(--color-brand-green)]' : 'bg-[var(--color-brand-red)]'} opacity-[0.02] blur-2xl group-hover:opacity-[0.05] transition-opacity`} />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[var(--color-brand-text)] font-semibold truncate max-w-[200px]" title={url}>{url}</h3>
          <p className="text-sm font-mono text-[var(--color-brand-muted)] mt-1 flex items-center gap-1">
            {isTop ? <Activity className="w-3 h-3" /> : <Flame className="w-3 h-3" />}
            {isTop ? 'Optimized' : 'Needs Work'}
          </p>
        </div>
        <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-[var(--color-brand-bg)] border border-[var(--color-brand-border-strong)] hover:bg-[var(--color-brand-charcoal)] rounded-lg transition-colors">
          <ArrowUpRight className="w-4 h-4 text-[var(--color-brand-muted)] group-hover:text-[var(--color-brand-text)] transition-colors" />
        </a>
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <p className="font-mono text-[var(--color-brand-muted)] uppercase tracking-widest text-[10px]">Global Score</p>
          <div className={`text-4xl font-mono font-bold ${colorClass}`}>
            <CountUp end={score} duration={2.5} />
            <span className="text-xl text-[var(--color-brand-muted)] opacity-50">/100</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full ${bgClass} ${colorClass} text-xs font-bold uppercase tracking-wider`}>
          {type}
        </div>
      </div>
    </div>
  );
}
