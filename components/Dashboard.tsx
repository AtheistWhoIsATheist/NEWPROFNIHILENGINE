
import React from 'react';
import { Note } from '../types';
import { BookOpen, Brain, Activity, Clock } from 'lucide-react';
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
    { name: 'Collapse', value: stats.collapse, color: '#ef4444' },
    { name: 'Awakening', value: stats.awakening, color: '#a855f7' },
    { name: 'Integration', value: stats.integration, color: '#10b981' }
  ].filter(d => d.value > 0);

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-void-900 border border-void-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <span className="text-void-400 font-mono text-xs uppercase tracking-wider">{label}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-3xl font-bold text-void-100">{value}</div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto bg-void-950">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-void-100 font-mono mb-2">COMMAND DECK</h1>
        <p className="text-void-400">System status and philosophical trajectory.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Entries" value={stats.total} icon={BookOpen} color="text-void-100" />
        <StatCard label="In Collapse" value={stats.collapse} icon={Activity} color="text-collapse" />
        <StatCard label="Awakening" value={stats.awakening} icon={Brain} color="text-awakening" />
        <StatCard label="Integrated" value={stats.integration} icon={Clock} color="text-integration" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-gradient-to-br from-void-900 to-void-950 border border-void-800 p-8 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Brain className="w-32 h-32" />
          </div>
          <h3 className="text-awakening font-mono text-xs uppercase tracking-widest mb-6 font-bold">Philosophical Reflection</h3>
          <blockquote className="text-2xl font-serif text-void-200 italic mb-4 leading-relaxed">
            "We are all geniuses when we dream, the problem is that we are not asleep."
          </blockquote>
          <cite className="text-void-400 font-mono not-italic">— Emil Cioran</cite>
        </div>

        <div className="bg-void-900 border border-void-800 p-6 rounded-lg flex flex-col items-center justify-center">
          <h3 className="text-void-400 font-mono text-xs uppercase tracking-widest mb-4 w-full text-left">Phase Distribution</h3>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="md:col-span-3 bg-void-900 border border-void-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-void-800 flex justify-between items-center">
            <h3 className="text-void-400 font-mono text-xs uppercase tracking-widest">Recent Activity</h3>
          </div>
          <div className="divide-y divide-void-800">
            {notes.slice(0, 5).map(note => (
              <div key={note.id} className="p-4 hover:bg-void-800/50 transition-colors flex justify-between items-center">
                <div>
                  <h4 className="text-void-200 font-medium">{note.title || 'Untitled'}</h4>
                  <p className="text-xs text-void-500 font-mono mt-1">{new Date(note.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                   <div className="flex flex-col items-end">
                      <span className={`text-[10px] uppercase font-bold ${
                        note.phase === 'collapse' ? 'text-collapse' :
                        note.phase === 'awakening' ? 'text-awakening' :
                        'text-integration'
                      }`}>{note.phase}</span>
                      {/* Fixed: note.scores.existentialDread was an invalid access; using note.metrics.DQ (0-3 scale) */}
                      <span className="text-[10px] text-void-600">Dread: {note.metrics.DQ}/3</span>
                   </div>
                </div>
              </div>
            ))}
            {notes.length === 0 && (
              <div className="p-8 text-center text-void-600 font-mono text-sm">No data points acquired.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
