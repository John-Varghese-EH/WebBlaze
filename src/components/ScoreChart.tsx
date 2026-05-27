import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  url: string;
  score: number;
}

export function ScoreChart({ data }: { data: ChartData[] }) {
  // Sort data by score ascending for a nice waterfall/distribution effect
  const sortedData = [...data].sort((a, b) => a.score - b.score);

  return (
    <div className="w-full h-64 md:h-80 bg-[var(--color-brand-charcoal-light)] rounded-2xl border border-[var(--color-brand-border-strong)] p-4 md:p-6 mt-12 flex flex-col">
      <h4 className="text-[var(--color-brand-text)] font-mono text-xs uppercase tracking-wider mb-6 flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 bg-[var(--color-brand-red)] rounded-full animate-pulse" />
        Global Score Distribution
      </h4>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="url" 
              tick={{ fill: 'var(--color-brand-muted)', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => val.replace('https://', '').replace('www.', '').split('.')[0]}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fill: 'var(--color-brand-muted)', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'var(--color-brand-border)' }}
              contentStyle={{ 
                backgroundColor: 'var(--color-brand-charcoal)', 
                border: '1px solid var(--color-brand-border-strong)',
                borderRadius: '8px',
                color: 'var(--color-brand-text)',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
              itemStyle={{ color: 'var(--color-brand-red)' }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.score > 80 ? 'var(--color-brand-green)' : entry.score > 50 ? 'var(--color-brand-red)' : 'var(--color-brand-muted)'} 
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
