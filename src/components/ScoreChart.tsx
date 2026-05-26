import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  url: string;
  score: number;
}

export function ScoreChart({ data }: { data: ChartData[] }) {
  // Sort data by score ascending for a nice waterfall/distribution effect
  const sortedData = [...data].sort((a, b) => a.score - b.score);

  return (
    <div className="w-full h-64 md:h-80 bg-[var(--color-brand-charcoal-light)] rounded-2xl border border-white/5 p-4 md:p-6 mt-12">
      <h4 className="text-white font-mono text-xs uppercase tracking-wider mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-[var(--color-brand-red)] rounded-full animate-pulse" />
        Global Score Distribution
      </h4>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={sortedData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="url" 
            tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => val.replace('https://', '').replace('www.', '').split('.')[0]}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ 
              backgroundColor: '#111', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#F85149' }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.score > 80 ? '#39FF14' : entry.score > 50 ? '#F85149' : '#888888'} 
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
