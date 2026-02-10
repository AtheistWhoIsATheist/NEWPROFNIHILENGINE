
import React from 'react';
import { Note } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface AnalysisWorkspaceProps {
  notes: Note[];
}

export const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({ notes }) => {
  const aggregates = notes.reduce((acc, note) => ({
    M: acc.M + note.weights.M,
    E: acc.E + note.weights.E,
    L: acc.L + note.weights.L,
    D: acc.D + note.weights.D,
    N: acc.N + note.weights.N,
    O: acc.O + note.weights.O,
    count: acc.count + 1
  }), { M: 0, E: 0, L: 0, D: 0, N: 0, O: 0, count: 0 });

  const radarData = aggregates.count ? [
    { subject: 'Meaning (M)', A: aggregates.M / aggregates.count, fullMark: 10 },
    { subject: 'Ethics (E)', A: aggregates.E / aggregates.count, fullMark: 10 },
    { subject: 'Language (L)', A: aggregates.L / aggregates.count, fullMark: 10 },
    { subject: 'Despair (D)', A: aggregates.D / aggregates.count, fullMark: 10 },
    { subject: 'Negation (N)', A: aggregates.N / aggregates.count, fullMark: 10 },
    { subject: 'Void (O)', A: aggregates.O / aggregates.count, fullMark: 10 }
  ] : [];

  return (
    <div className="p-8 h-full overflow-y-auto bg-void-950">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-void-100 font-mono mb-2 tracking-tighter">OS_METRICS_DASHBOARD</h1>
        <p className="text-void-500 font-mono text-xs uppercase tracking-widest">Quantitative mapping of PNT vertices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-void-900/40 border border-void-800 p-8 rounded-2xl h-[500px] flex flex-col">
          <h3 className="text-void-400 font-mono text-[10px] uppercase tracking-[0.3em] mb-8">Aggregate Topology Resonance</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#181818" />
              <Radar name="System Avg" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
              <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-void-900/40 border border-void-800 p-6 rounded-2xl">
            <h4 className="text-void-500 font-mono text-[10px] uppercase tracking-widest mb-4">Recursive Integrity</h4>
            <div className="text-4xl font-bold text-void-100 font-mono">
              {(notes.reduce((acc, n) => acc + n.recursiveDepth, 0) / (notes.length || 1)).toFixed(2)}
            </div>
            <p className="text-void-600 text-[10px] font-mono mt-2">AVG RECURSIVE DEPTH</p>
          </div>
          
          <div className="bg-void-900/40 border border-void-800 p-6 rounded-2xl">
            <h4 className="text-void-500 font-mono text-[10px] uppercase tracking-widest mb-4">Heresy Distribution</h4>
            <div className="space-y-2">
              {['mild', 'moderate', 'radical', 'terminal'].map(h => {
                const count = notes.filter(n => n.hereticalIntensity === h).length;
                return (
                  <div key={h} className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-void-400 uppercase">{h}</span>
                    <span className="text-void-100">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
