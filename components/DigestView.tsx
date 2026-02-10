
import React, { useState, useEffect } from 'react';
import { Source, WeeklyDigest } from '../types';
import { generateWeeklyDigest } from '../services/geminiService';
import { Calendar, RefreshCcw, ArrowRight, Activity, Zap } from 'lucide-react';

interface DigestViewProps {
  sources: Source[];
}

export const DigestView: React.FC<DigestViewProps> = ({ sources }) => {
  const [digest, setDigest] = useState<WeeklyDigest | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDigest = async () => {
    if (sources.length === 0) return;
    setLoading(true);
    try {
      const result = await generateWeeklyDigest(sources);
      setDigest({
        id: crypto.randomUUID(),
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
        ...result
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sources.length > 0 && !digest) fetchDigest();
  }, [sources]);

  return (
    <div className="space-y-8 bg-void-950 p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold font-mono text-void-100 tracking-tighter uppercase">Weekly_Digest</h1>
          <p className="text-void-500 font-mono text-xs uppercase tracking-widest mt-1">SYMBIONT_REPORTS v0.1</p>
        </div>
        <button 
          onClick={fetchDigest} 
          disabled={loading || sources.length === 0}
          className="flex items-center space-x-2 bg-void-900 border border-void-800 text-void-400 px-4 py-2 rounded-lg text-xs font-mono hover:text-awakening transition-all"
        >
          <RefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>GENERATE_REPORT</span>
        </button>
      </div>

      {digest ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <section className="bg-void-900/50 p-8 rounded-2xl border border-void-800 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <Activity className="w-5 h-5 text-awakening" />
                <h3 className="text-sm font-bold font-mono text-void-200 uppercase tracking-widest">Changes_Summary</h3>
              </div>
              <p className="text-void-300 text-sm leading-relaxed font-serif italic">
                {digest.changesSummary}
              </p>
            </section>

            <section className="bg-void-900/50 p-8 rounded-2xl border border-void-800 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <Zap className="w-5 h-5 text-integration" />
                <h3 className="text-sm font-bold font-mono text-void-200 uppercase tracking-widest">Recommended_Actions</h3>
              </div>
              <div className="space-y-4">
                {digest.nextActions.map((action, i) => (
                  <div key={i} className="flex items-start space-x-3 text-sm text-void-400 group">
                    <ArrowRight className="w-4 h-4 mt-1 text-void-700 group-hover:text-awakening transition-colors" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="bg-void-900/50 p-8 rounded-2xl border border-void-800 shadow-xl">
            <h3 className="text-sm font-bold font-mono text-void-200 uppercase tracking-widest mb-8">ENTITIES_DISCOVERED</h3>
            <div className="flex flex-wrap gap-3">
              {digest.entitiesDiscovered.map(name => (
                <span key={name} className="px-4 py-2 bg-void-950 border border-void-800 text-void-300 text-[10px] font-mono rounded-full hover:border-awakening transition-colors cursor-default">
                  {name.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-void-900 rounded-3xl">
          <Calendar className="w-12 h-12 text-void-800 mb-4" />
          <p className="text-void-700 font-mono text-sm tracking-widest uppercase">Awaiting_Data_Threshold</p>
        </div>
      )}
    </div>
  );
};
