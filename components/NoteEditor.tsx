
import React, { useState } from 'react';
import { Sparkles, Tag, Clock, Activity, Target, ShieldAlert, Layers } from 'lucide-react';
import { Note, AporiaMarker } from '../types';
import { analyzeNoteWithGemini } from '../services/geminiService';

interface NoteEditorProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ notes, setNotes }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleCreateNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'New Fragment',
      content: '',
      phase: 'collapse',
      hereticalIntensity: 'mild',
      recursiveDepth: 0,
      weights: { M: 0, E: 0, L: 0, D: 0, N: 0, O: 0 },
      metrics: { DQ: 0, EE: 0, AI: 0, TRP: 0 },
      tags: [],
      aporiaMarkers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCanon: false
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const activeNote = notes.find(n => n.id === selectedNoteId);

  const updateActiveNote = (updates: Partial<Note>) => {
    if (!activeNote) return;
    setNotes(prev => prev.map(n => n.id === activeNote.id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  };

  const handleAnalyze = async () => {
    if (!activeNote || !activeNote.content) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeNoteWithGemini(activeNote.content);
      updateActiveNote({
        weights: result.weights,
        metrics: result.metrics,
        phase: result.phase,
        hereticalIntensity: result.hereticalIntensity,
        tags: result.tags,
        aiAnalysis: result.analysis,
        recursiveDepth: activeNote.recursiveDepth + 1
      });
    } catch (e) {
      console.error("Analysis failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const MetricPill = ({ label, value, max = 3 }: { label: string, value: number, max?: number }) => (
    <div className="flex items-center justify-between bg-void-950 p-2 rounded border border-void-800">
      <span className="text-[10px] font-mono text-void-500">{label}</span>
      <div className="flex space-x-1">
        {[...Array(max)].map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-sm ${i < value ? 'bg-awakening' : 'bg-void-800'}`}></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-void-950">
      <div className="w-72 border-r border-void-800 flex flex-col bg-void-900/30">
        <div className="p-6 border-b border-void-800 flex justify-between items-center">
          <h2 className="font-mono text-xs text-void-500 font-bold tracking-[0.3em] uppercase">Laboratory</h2>
          <button onClick={handleCreateNote} className="text-void-400 hover:text-white transition-colors text-xl font-light">+</button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notes.map(note => (
            <div 
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`p-5 border-b border-void-900 cursor-pointer transition-all ${selectedNoteId === note.id ? 'bg-void-900 shadow-[inset_4px_0_0_#a855f7]' : 'hover:bg-void-900/50'}`}
            >
              <h3 className="text-void-200 text-sm font-medium truncate mb-2">{note.title}</h3>
              <div className="flex items-center space-x-2">
                 <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                   note.hereticalIntensity === 'terminal' ? 'bg-collapse/10 text-collapse border-collapse/20' : 'bg-void-800 text-void-400 border-void-700'
                 }`}>{note.hereticalIntensity}</span>
                 <span className="text-[9px] text-void-600 font-mono">D: {note.recursiveDepth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeNote ? (
        <div className="flex-1 flex flex-col">
          <div className="px-8 py-6 border-b border-void-800 flex justify-between items-center bg-void-950/80 backdrop-blur-md">
            <div className="flex-1">
              <input 
                value={activeNote.title}
                onChange={(e) => updateActiveNote({ title: e.target.value })}
                className="bg-transparent text-xl font-bold text-void-100 placeholder-void-700 focus:outline-none w-full font-mono tracking-tight"
                placeholder="GENESIS VECTOR..."
              />
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`flex items-center space-x-2 px-6 py-2 rounded font-mono text-[10px] uppercase tracking-widest transition-all ${
                  isAnalyzing ? 'bg-void-800 text-void-500' : 'bg-void-100 text-void-950 hover:bg-white'
                }`}
              >
                <Sparkles className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Densifying...' : 'Densify'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col">
              <textarea
                value={activeNote.content}
                onChange={(e) => updateActiveNote({ content: e.target.value })}
                className="flex-1 bg-void-950 p-8 text-void-300 resize-none focus:outline-none leading-relaxed font-sans text-lg selection:bg-awakening/30"
                placeholder="Capture the spark..."
              />
              {activeNote.aiAnalysis && (
                <div className="h-1/4 border-t border-void-800 bg-void-900/50 p-6 overflow-y-auto">
                   <div className="flex items-center space-x-2 mb-3 text-awakening">
                     <Target className="w-3 h-3" />
                     <span className="text-[10px] font-bold font-mono uppercase tracking-widest">SPE Synthesis</span>
                   </div>
                   <p className="text-sm text-void-400 italic font-serif leading-relaxed">
                     "{activeNote.aiAnalysis}"
                   </p>
                </div>
              )}
            </div>
            
            <div className="w-80 border-l border-void-800 bg-void-900/20 p-6 overflow-y-auto space-y-8">
              <section>
                <h4 className="text-[10px] font-bold text-void-500 uppercase tracking-[0.2em] mb-4 font-mono">Canon Metrics</h4>
                <div className="grid grid-cols-1 gap-2">
                  <MetricPill label="DQ (Despair)" value={activeNote.metrics.DQ} />
                  <MetricPill label="EE (Entropy)" value={activeNote.metrics.EE} />
                  <MetricPill label="AI (Impact)" value={activeNote.metrics.AI} />
                  <MetricPill label="TRP (Resonance)" value={activeNote.metrics.TRP} />
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-bold text-void-500 uppercase tracking-[0.2em] mb-4 font-mono">Genesis Status</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-void-600">Heretical Intensity:</span>
                    <span className="text-collapse font-bold uppercase">{activeNote.hereticalIntensity}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-void-600">Recursive Depth:</span>
                    <span className="text-void-200">{activeNote.recursiveDepth}</span>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-bold text-void-500 uppercase tracking-[0.2em] mb-4 font-mono">Topology Weights</h4>
                <div className="space-y-2">
                  {Object.entries(activeNote.weights).map(([key, val]) => (
                    <div key={key} className="flex items-center space-x-3">
                      <span className="text-[10px] font-bold font-mono text-void-400 w-4">{key}</span>
                      <div className="h-1 flex-1 bg-void-800 rounded-full">
                        {/* Fixed: cast val as number for the arithmetic operation in the style prop */}
                        <div className="h-full bg-awakening" style={{ width: `${(val as number) * 10}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
           <div className="text-center opacity-20">
              <Activity className="w-16 h-16 mx-auto mb-4 text-void-600" />
              <p className="font-mono text-xs uppercase tracking-[0.5em]">Awaiting Input Vectors</p>
           </div>
        </div>
      )}
    </div>
  );
};
