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

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="group relative p-6 bg-[var(--color-brand-charcoal-light)] rounded-none border-2 border-[var(--color-brand-border-strong)] hover:border-[var(--color-brand-text)] transition-all flex flex-col justify-between overflow-hidden shadow-[4px_4px_0px_var(--color-brand-border-strong)] hover:shadow-[4px_4px_0px_var(--color-brand-text)] hover:-translate-y-1 hover:-translate-x-1">
      <div className={`absolute top-0 right-0 w-32 h-32 ${isTop ? 'bg-[var(--color-brand-green)]' : 'bg-[var(--color-brand-red)]'} opacity-[0.02] blur-2xl group-hover:opacity-[0.05] transition-opacity`} />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[var(--color-brand-text)] font-semibold truncate max-w-[200px]" title={url}>{url}</h3>
          <p className="text-sm font-mono text-[var(--color-brand-muted)] mt-1 flex items-center gap-1">
            {isTop ? <Activity className="w-3 h-3" /> : <Flame className="w-3 h-3" />}
            {isTop ? 'Optimized' : 'Needs Work'}
          </p>
        </div>
        <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-[var(--color-brand-bg)] border-2 border-[var(--color-brand-border-strong)] hover:border-[var(--color-brand-text)] hover:bg-[var(--color-brand-charcoal)] transition-colors">
          <ArrowUpRight className="w-4 h-4 text-[var(--color-brand-muted)] group-hover:text-[var(--color-brand-text)] transition-colors" />
        </a>
      </div>

      <div className="flex items-end justify-between mt-4">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center w-20 h-20">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-[var(--color-brand-charcoal)]"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                className={`${colorClass} transition-all duration-[2.5s] ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-mono font-black ${colorClass} tracking-tighter`}>
                 <CountUp end={score} duration={2.5} />
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-mono text-[var(--color-brand-muted)] uppercase tracking-widest text-[10px]">Global Score</p>
            <div className={`px-2 py-1 inline-block text-center border-2 border-current ${bgClass} ${colorClass} text-xs font-black uppercase tracking-widest`}>
              {type}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
