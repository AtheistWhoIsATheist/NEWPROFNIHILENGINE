import React, { useState } from 'react';
import { Search, BrainCircuit, ArrowRight, Loader2, Target, Info, Sparkles } from 'lucide-react';
import { ResearchQuery } from '../types';
import { deepResearch } from '../services/geminiService';

export const ResearchHub: React.FC = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<ResearchQuery[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);

  const handleResearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setCurrentCycle(1);
    
    // Simulate thinking cycles for visual feedback since we can't get real-time progress from generateContent yet
    const cycleInterval = setInterval(() => {
        setCurrentCycle(c => c + 1);
    }, 2000);

    try {
      const response = await deepResearch(query);
      const newRecord: ResearchQuery = {
        id: crypto.randomUUID(),
        prompt: query,
        response,
        model: 'gemini-3-pro-preview',
        timestamp: new Date().toISOString(),
        resonanceBoost: true
      };
      setHistory([newRecord, ...history]);
      setQuery('');
    } catch (e) {
      console.error(e);
    } finally {
      clearInterval(cycleInterval);
      setCurrentCycle(0);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#000000] p-12 max-w-[1400px] mx-auto w-full relative">
      <header className="mb-12">
        <h2 className="text-5xl font-black text-white font-mono tracking-tighter uppercase mb-4">Densification_Engine</h2>
        <div className="flex items-center space-x-4">
           <div className="h-1 w-1 bg-neon-purple rounded-full animate-ping"></div>
           <p className="text-void-500 font-mono text-[11px] uppercase tracking-[0.5em]">Iterative_Saturation_Protocol // Thinking_Budget: 32k</p>
        </div>
      </header>

      <div className="glass-card p-2 rounded-[40px] border border-white/5 shadow-2xl mb-12 focus-within:border-neon-purple transition-all">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-black/40 text-void-100 p-10 min-h-[160px] rounded-[36px] focus:outline-none font-sans text-xl leading-relaxed resize-none placeholder-void-800"
            placeholder="Input philosophical inquiry for iterative saturation..."
          />
          <div className="absolute bottom-10 right-10 flex space-x-4">
            {loading && (
              <div className="flex items-center px-6 py-3 bg-neon-purple/10 rounded-full border border-neon-purple/20 text-[10px] text-neon-purple font-mono uppercase tracking-widest animate-pulse">
                <BrainCircuit className="w-4 h-4 mr-3" />
                Cycle_{currentCycle}: Deep_Recursive_Thought
              </div>
            )}
            <button
              onClick={handleResearch}
              disabled={loading || !query}
              className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-neon-purple hover:text-white disabled:opacity-20 transition-all duration-500 shadow-2xl"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-12 pr-4 custom-scrollbar">
        {history.map(item => (
          <div key={item.id} className="group animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="flex items-center space-x-6 mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="h-[1px] bg-void-800 flex-1"></div>
                <div className="flex items-center space-x-3 text-[10px] font-mono text-void-500 uppercase tracking-widest">
                   <Target className="w-3 h-3" />
                   <span>VECTOR_TIMESTAMP: {new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="h-[1px] bg-void-800 flex-1"></div>
             </div>
             
             <div className="mb-10 px-10">
               <h3 className="text-void-600 font-mono text-[10px] uppercase tracking-[0.4em] mb-4 font-bold">Inquiry_Vector</h3>
               <p className="text-3xl text-white font-serif italic border-l-4 border-neon-purple/40 pl-10 leading-snug">
                 {item.prompt}
               </p>
             </div>

             <div className="glass-card rounded-[48px] p-16 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                  <Sparkles className="w-64 h-64 text-neon-purple" />
                </div>
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center space-x-4">
                     <div className="w-10 h-10 bg-neon-purple rounded-xl flex items-center justify-center shadow-neon-purple/20">
                        <Info className="w-5 h-5 text-white" />
                     </div>
                     <h3 className="text-white font-mono text-xs uppercase tracking-[0.3em] font-bold">Densification_Output</h3>
                  </div>
                  <span className="text-[10px] bg-white/5 px-4 py-1.5 rounded-full text-void-500 font-mono tracking-widest border border-white/5">GEMINI_3_PRO_THINKING_32K</span>
                </div>
                <div className="prose prose-invert prose-lg max-w-none text-void-200 leading-[1.8] font-sans whitespace-pre-wrap">
                  {item.response}
                </div>
             </div>
          </div>
        ))}
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <BrainCircuit className="w-20 h-20 text-void-700 mb-8" />
            <p className="font-mono text-xs uppercase tracking-[0.6em]">Awaiting_Cognitive_Input</p>
          </div>
        )}
      </div>
    </div>
  );
};