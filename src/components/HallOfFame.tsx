import { Target, AlertTriangle } from 'lucide-react';
import { ScoreCard } from './ScoreCard';
import { ScoreChart } from './ScoreChart';
import { useAuditHistory } from '../lib/useAuditHistory';

const TOP_SITES = [
  { url: 'stripe.com', score: 98 },
  { url: 'linear.app', score: 96 },
  { url: 'vercel.com', score: 95 },
  { url: 'github.com', score: 94 },
];

const FLOP_SITES = [
  { url: 'craigslist.org', score: 42 },
  { url: 'berkshirehathaway.com', score: 38 },
  { url: 'arngren.net', score: 12 },
  { url: 'lingscars.com', score: 8 },
];

export function HallOfFame() {
  const { history } = useAuditHistory();

  // Combine top, flop and history to show on chart
  const combinedData = [
    ...TOP_SITES,
    ...FLOP_SITES,
    ...history.map(h => ({ url: h.url, score: h.score }))
  ];

  // Make unique by URL for the chart so lines don't duplicate badly
  const chartData = Array.from(new Map(combinedData.map(item => [item.url, item])).values());

  return (
    <section id="hall-of-fame" className="py-24 px-6 relative border-t border-white/5 bg-[var(--color-brand-bg)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Hall of <span className="text-gradient">Fame & Shame</span>
          </h2>
          <p className="text-gray-400 font-mono text-sm">Recent global audit results.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8">
          
          {/* TOP */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2 bg-[var(--color-brand-green)]/10 rounded-lg">
                <Target className="w-5 h-5 text-[var(--color-brand-green)]" />
              </div>
              <h3 className="text-2xl font-bold text-white">The Elite</h3>
              <span className="ml-auto flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 uppercase tracking-wider">
                Top Performers
              </span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {TOP_SITES.map((site) => (
                <ScoreCard key={site.url} url={site.url} score={site.score} type="top" />
              ))}
            </div>
          </div>

          {/* FLOP */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2 bg-[var(--color-brand-red)]/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-[var(--color-brand-red)]" />
              </div>
              <h3 className="text-2xl font-bold text-white">The Embers</h3>
              <span className="ml-auto flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 uppercase tracking-wider">
                Needs Rescue
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {FLOP_SITES.map((site) => (
                <ScoreCard key={site.url} url={site.url} score={site.score} type="flop" />
              ))}
            </div>
          </div>

        </div>
        
        {/* RECHARTS CHART SECTION */}
        <ScoreChart data={chartData} />
        
      </div>
    </section>
  );
}
