
import React, { useState } from 'react';
import { Search, BrainCircuit, ArrowRight, Loader2 } from 'lucide-react';
import { ResearchQuery } from '../types';
import { deepResearch } from '../services/geminiService';

export const ResearchHub: React.FC = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<ResearchQuery[]>([]);
  const [loading, setLoading] = useState(false);

  const handleResearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await deepResearch(query);
      const newRecord: ResearchQuery = {
        id: crypto.randomUUID(),
        prompt: query,
        response,
        model: 'gemini-3-pro-preview',
        timestamp: new Date().toISOString(),
        // Fixed: changed isDeepResearch to resonanceBoost to align with ResearchQuery interface
        resonanceBoost: true
      };
      setHistory([newRecord, ...history]);
      setQuery('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-void-950 p-6 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-void-100 font-mono mb-2">RESEARCH HUB</h2>
        <p className="text-void-400">Deep recursive densification via Gemini 3 Pro (Thinking Mode).</p>
      </div>

      {/* Input Area */}
      <div className="bg-void-900 p-1 rounded-lg border border-void-700 shadow-xl mb-8">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-void-950 text-void-200 p-4 min-h-[120px] rounded focus:outline-none font-sans text-lg resize-none"
            placeholder="Input philosophical inquiry for iterative saturation..."
          />
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <div className="flex items-center px-3 py-1 bg-void-900 rounded border border-void-700 text-xs text-awakening font-mono">
              <BrainCircuit className="w-3 h-3 mr-2" />
              Thinking Mode: ON (32k Budget)
            </div>
            <button
              onClick={handleResearch}
              disabled={loading || !query}
              className="px-4 py-2 bg-void-100 text-void-950 font-bold rounded hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Results Feed */}
      <div className="flex-1 overflow-y-auto space-y-8 pr-2">
        {history.map(item => (
          <div key={item.id} className="group">
             <div className="flex items-center space-x-4 mb-4">
                <div className="h-px bg-void-800 flex-1"></div>
                <span className="text-xs font-mono text-void-500 uppercase">{new Date(item.timestamp).toLocaleTimeString()}</span>
                <div className="h-px bg-void-800 flex-1"></div>
             </div>
             
             <div className="mb-4">
               <h3 className="text-void-400 font-mono text-sm mb-2 uppercase tracking-widest">Inquiry</h3>
               <p className="text-lg text-void-200 font-serif italic border-l-2 border-void-700 pl-4">{item.prompt}</p>
             </div>

             <div className="bg-void-900/30 rounded-lg p-6 border border-void-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-awakening font-mono text-sm uppercase tracking-widest font-bold">Densification Result</h3>
                  <span className="text-[10px] bg-void-800 px-2 py-1 rounded text-void-400 font-mono">gemini-3-pro</span>
                </div>
                <div className="prose prose-invert prose-void max-w-none text-void-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {item.response}
                </div>
             </div>
          </div>
        ))}
        {history.length === 0 && (
          <div className="text-center text-void-600 font-mono mt-20">
            [AWAITING INPUT VECTORS]
          </div>
        )}
      </div>
    </div>
  );
};
