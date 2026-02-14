import React from 'react';
import { Note } from '../types';
import { BookOpen, Brain, Activity, Clock, Zap, Target, ShieldCheck, Cpu } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  notes: Note[];
}

export const Dashboard: React.FC<DashboardProps> = ({ notes }) => {
  const stats = {
    total: notes.length,
    collapse: notes.filter(n => n.phase === 'collapse').length,
    awakening: notes.filter(n => n.phase === 'awakening').length,
    integration: notes.filter(n => n.phase === 'integration').length
  };

  const data = [
    { name: 'COLLAPSE', value: stats.collapse, color: '#f43f5e' },
    { name: 'AWAKENING', value: stats.awakening, color: '#a855f7' },
    { name: 'INTEGRATION', value: stats.integration, color: '#2dd4bf' }
  ].filter(d => d.value > 0);

  const StatCard = ({ label, value, icon: Icon, colorClass, borderClass, subLabel }: any) => (
    <div className="glass-card p-8 rounded-[32px] border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden">
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity ${colorClass}`}>
        <Icon className="w-full h-full" />
      </div>
      <div className="flex justify-between items-start mb-8">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-black/40 border ${borderClass} shadow-2xl`}>
           <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        <div className="text-right">
          <p className="text-[9px] text-void-500 font-mono uppercase tracking-[0.4em] mb-1">{label}</p>
          <p className="text-[10px] text-void-700 font-mono tracking-widest">{subLabel}</p>
        </div>
      </div>
      <div className="text-5xl font-black text-white font-mono tracking-tighter">{value}</div>
    </div>
  );

  return (
    <div className="p-12 max-w-[1600px] mx-auto h-full overflow-y-auto space-y-16">
      <header className="flex justify-between items-end border-b border-white/5 pb-12">
        <div>
          <h1 className="text-6xl font-black text-white font-mono tracking-tighter uppercase mb-3">Command_Deck</h1>
          <div className="flex items-center space-x-4">
             <div className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulse"></div>
             <p className="text-void-500 font-mono text-[11px] uppercase tracking-[0.5em]">SYSTEM_DIAGNOSTICS_LIVE // HEURISTIC_MAP</p>
          </div>
        </div>
        <div className="flex space-x-8 text-[10px] font-mono text-void-500 uppercase tracking-widest">
           <div className="flex flex-col items-end">
              <span className="text-neon-cyan font-bold mb-1">RESONANCE_INDEX</span>
              <span className="text-white text-lg">99.4%</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-neon-purple font-bold mb-1">ENTROPIC_STABILITY</span>
              <span className="text-white text-lg">0.002</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard label="OBJECTS_MAPPED" subLabel="SYNC_NOMINAL" value={stats.total} icon={BookOpen} colorClass="text-white" borderClass="border-white/10" />
        <StatCard label="COLLAPSE_DRIVE" subLabel="AXIS_CRITICAL" value={stats.collapse} icon={Activity} colorClass="text-neon-red" borderClass="border-neon-red/20" />
        <StatCard label="AWAKENING_VECTOR" subLabel="LUCID_PLENUM" value={stats.awakening} icon={Brain} colorClass="text-neon-purple" borderClass="border-neon-purple/20" />
        <StatCard label="INTEGRATION_SYNC" subLabel="AXIOM_STABLE" value={stats.integration} icon={ShieldCheck} colorClass="text-neon-teal" borderClass="border-neon-teal/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 glass-card rounded-[48px] p-12 relative overflow-hidden group border border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
            <Cpu className="w-56 h-56 text-neon-purple" />
          </div>
          <div className="flex items-center space-x-4 mb-12">
            <Zap className="w-6 h-6 text-neon-purple" />
            <h3 className="text-void-400 font-mono text-[11px] uppercase tracking-[0.5em] font-bold">Reflexive_Oracle_Stream</h3>
          </div>
          <blockquote className="text-5xl font-serif text-white leading-[1.2] italic mb-12 selection:bg-neon-purple/40">
            "Only those who have known the void of being can appreciate the fullness of nothingness."
          </blockquote>
          <div className="flex items-center space-x-6">
             <div className="h-[2px] w-16 bg-neon-purple shadow-[0_0_10px_#a855f7]"></div>
             <cite className="text-void-400 font-mono text-[11px] uppercase tracking-[0.3em] not-italic font-medium">Emil M. Cioran</cite>
          </div>
        </div>

        <div className="glass-card rounded-[48px] p-12 flex flex-col items-center justify-center border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center w-full mb-10">
            <h3 className="text-void-500 font-mono text-[11px] uppercase tracking-[0.4em]">Phase_Distribution</h3>
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-ping"></div>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={12}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} filter="url(#glow-chart)" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', color: '#fff', fontSize: '11px', fontFamily: 'monospace', padding: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-8 mt-12 w-full">
             {data.map(d => (
               <div key={d.name} className="text-center group cursor-default">
                  <div className="text-xs font-mono text-white font-bold mb-2 group-hover:text-neon-cyan transition-colors">{d.value}</div>
                  <div className="text-[9px] font-mono text-void-600 uppercase tracking-[0.2em]">{d.name}</div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};