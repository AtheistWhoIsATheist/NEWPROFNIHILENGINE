import React, { useState } from 'react';
import { Flame, ArrowRight, Loader2, Scroll, Book, Skull, BrainCircuit } from 'lucide-react';
import { runRenAnalysis } from '../services/geminiService';

export const RenMode: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [inputContext, setInputContext] = useState('');
  const [results, setResults] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      number: 1,
      title: "Foundational Concepts",
      icon: Book,
      description: "Examine the intersection of religious experience and the notion of Nothingness."
    },
    {
      number: 2,
      title: "Key Figures",
      icon: Scroll,
      description: "Study perspectives of figures like Nishitani, Tillich, and Eckhart."
    },
    {
      number: 3,
      title: "Existential Dread",
      icon: Skull,
      description: "Analyze the role of dread and the quest for meaning in the void."
    },
    {
      number: 4,
      title: "Synthesize Insights",
      icon: BrainCircuit,
      description: "Integrate insights into a comprehensive philosophical framework."
    }
  ];

  const handleRunStep = async (stepNumber: number) => {
    if (!inputContext.trim()) return;
    setActiveStep(stepNumber);
    setLoading(true);
    try {
      const result = await runRenAnalysis(stepNumber, inputContext);
      setResults(prev => ({ ...prev, [stepNumber]: result }));
    } catch (e) {
      console.error(e);
      setResults(prev => ({ ...prev, [stepNumber]: "<p class='text-neon-red'>ERROR: ONTOLOGICAL CONNECTION FAILED</p>" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden text-void-100">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-orange-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-900/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="flex-1 flex overflow-hidden z-10">
        {/* Left Panel: Controls */}
        <div className="w-[450px] border-r border-white/5 bg-black/40 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <div className="p-10 border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-orange-950/30 rounded-full flex items-center justify-center border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif tracking-tight text-white">REN Mode</h1>
                <p className="text-[10px] font-mono text-orange-400/60 uppercase tracking-[0.2em]">Religious Experience of Nihilism</p>
              </div>
            </div>
            <p className="text-xs text-void-400 leading-relaxed font-serif italic border-l-2 border-orange-900/50 pl-4">
              "To confront the void is an act of faith. To find god in the void is the ultimate heresy."
            </p>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-void-500 uppercase tracking-widest block">Contextual_Input</label>
              <textarea 
                value={inputContext}
                onChange={(e) => setInputContext(e.target.value)}
                placeholder="Enter a philosophical concept, a personal experience of the void, or a theological paradox..."
                className="w-full bg-void-900/50 border border-void-800 rounded-xl p-4 text-sm text-void-200 focus:outline-none focus:border-orange-500/30 min-h-[120px] resize-none font-serif placeholder-void-700 transition-all"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-void-500 uppercase tracking-widest block">Protocol_Steps</label>
                <div className="h-[1px] flex-1 bg-void-800 ml-4"></div>
              </div>
              
              {steps.map((step) => {
                const isResultReady = !!results[step.number];
                const isActive = activeStep === step.number;
                
                return (
                  <button
                    key={step.number}
                    onClick={() => handleRunStep(step.number)}
                    disabled={loading || !inputContext}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? 'bg-orange-950/20 border-orange-500/30' 
                        : isResultReady
                        ? 'bg-void-900/30 border-void-800 hover:border-void-600'
                        : 'bg-void-950 border-void-800/50 hover:bg-void-900 hover:border-void-700 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {isActive && loading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                    )}
                    
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex items-start space-x-4">
                        <div className={`mt-1 w-6 h-6 rounded flex items-center justify-center font-mono text-xs border ${
                           isActive || isResultReady ? 'bg-orange-500 text-black border-orange-500' : 'bg-void-900 text-void-600 border-void-700'
                        }`}>
                          {step.number}
                        </div>
                        <div>
                          <h3 className={`font-mono text-xs font-bold uppercase tracking-wider mb-1 ${isActive || isResultReady ? 'text-orange-100' : 'text-void-400'}`}>
                            {step.title}
                          </h3>
                          <p className="text-[11px] text-void-500 leading-tight max-w-[200px]">{step.description}</p>
                        </div>
                      </div>
                      <div className={`transition-transform duration-300 ${isActive && loading ? 'rotate-90' : ''}`}>
                         {isActive && loading ? <Loader2 className="w-4 h-4 text-orange-500 animate-spin" /> : <step.icon className={`w-4 h-4 ${isResultReady ? 'text-orange-400' : 'text-void-700'}`} />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="mt-auto p-8 border-t border-white/5 bg-black/20">
            <h4 className="text-[10px] font-mono text-void-600 uppercase tracking-[0.2em] mb-4">Terminology_Ref</h4>
            <ul className="space-y-4">
               <li className="text-[10px] text-void-500">
                 <strong className="text-void-300 block mb-1">Nihilism</strong>
                 Negation of meaningful aspects of life.
               </li>
               <li className="text-[10px] text-void-500">
                 <strong className="text-void-300 block mb-1">Religious Experience</strong>
                 Encounters with ultimate reality.
               </li>
               <li className="text-[10px] text-void-500">
                 <strong className="text-void-300 block mb-1">Existential Dread</strong>
                 Anxiety from inherent meaninglessness.
               </li>
            </ul>
          </div>
        </div>

        {/* Right Panel: Output */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-black/20">
          <div className="max-w-4xl mx-auto space-y-12">
            {Object.entries(results).map(([stepNum, content]) => {
              const stepInfo = steps.find(s => s.number === Number(stepNum));
              return (
                <div key={stepNum} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                   <div className="flex items-center space-x-4 mb-6 opacity-60">
                      <div className="h-[1px] bg-orange-900/30 flex-1"></div>
                      <span className="text-[10px] font-mono text-orange-500/60 uppercase tracking-[0.3em]">{stepInfo?.title || `STEP ${stepNum}`}</span>
                      <div className="h-[1px] bg-orange-900/30 flex-1"></div>
                   </div>
                   
                   <div className="glass-card rounded-[32px] p-12 border border-orange-500/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                         {stepInfo && <stepInfo.icon className="w-64 h-64 text-orange-500" />}
                      </div>
                      <div 
                        className="prose prose-invert prose-orange max-w-none font-serif text-lg leading-loose text-void-200 prose-headings:font-mono prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-sm prose-headings:text-orange-400"
                        dangerouslySetInnerHTML={{ __html: content }} 
                      />
                   </div>
                </div>
              );
            })}
            
            {Object.keys(results).length === 0 && !loading && (
               <div className="h-full flex flex-col items-center justify-center opacity-20 py-32">
                  <Flame className="w-24 h-24 text-void-700 mb-6" />
                  <p className="font-mono text-xs uppercase tracking-[0.6em] text-void-500">Awaiting_Ren_Initiation</p>
               </div>
            )}
            
            {loading && !activeStep && (
               <div className="flex justify-center py-20">
                 <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};