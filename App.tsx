import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ResearchHub } from './components/ResearchHub';
import { NoteEditor } from './components/NoteEditor';
import { ConceptMap } from './components/ConceptMap';
import { AnalysisWorkspace } from './components/AnalysisWorkspace';
import { PhilosophicalFramework } from './components/PhilosophicalFramework';
import { ChatInterface } from './components/ChatInterface';
import { KnowledgeIngestion } from './components/KnowledgeIngestion';
import { LibraryBrowser } from './components/LibraryBrowser';
import { SummaryFeed } from './components/SummaryFeed';
import { DigestView } from './components/DigestView';
import { RenMode } from './components/RenMode';
import { Note, Source } from './types';

const initialNotes: Note[] = [
  {
    id: 'cioran-seed',
    title: 'The Heights of Despair',
    content: 'Only those who have known the void of being can appreciate the fullness of nothingness.',
    phase: 'collapse',
    hereticalIntensity: 'radical',
    recursiveDepth: 1,
    weights: { M: 2.1, E: 1.5, L: 4.2, D: 9.8, N: 7.2, O: 8.5 },
    metrics: { DQ: 9.5, EE: 4.2, AI: 8.1, TRP: 6.7 },
    tags: ['cioran', 'pessimism', 'ontological_void'],
    aporiaMarkers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiAnalysis: 'High D-axis saturation detected. Suggesting transition to Awakening protocol.',
    isCanon: true
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);

  const handleSourceAdded = (source: Source) => {
    setSources(prev => [source, ...prev]);
  };

  const addNote = (note: Note) => {
    setNotes(prev => [note, ...prev]);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard notes={notes} />;
      case 'ren_mode': return <RenMode />;
      case 'chat': return <ChatInterface />;
      case 'research': return <ResearchHub />;
      case 'library': return (
        <div className="p-12 h-full overflow-y-auto grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-1 space-y-12">
            <KnowledgeIngestion onSourceAdded={handleSourceAdded} />
            <LibraryBrowser sources={sources} onSelect={setSelectedSource} />
          </div>
          <div className="xl:col-span-2">
            {selectedSource ? (
              <div className="glass-card rounded-[48px] p-16 animate-in fade-in slide-in-from-right-12 duration-500 border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-4xl font-bold text-white font-mono tracking-tighter">{selectedSource.title}</h2>
                  <button onClick={() => setSelectedSource(null)} className="text-void-500 hover:text-white font-mono text-xs uppercase tracking-widest px-4 py-2 bg-white/5 rounded-full transition-all">Close_Terminal</button>
                </div>
                <div className="space-y-12">
                  <section>
                    <h4 className="text-[11px] font-bold text-void-500 uppercase tracking-[0.4em] mb-6 font-mono">Conceptual_Axiom</h4>
                    <div className="glass bg-black/40 p-8 rounded-3xl border border-white/5 font-serif italic text-2xl text-void-100 leading-relaxed">
                      {selectedSource.summaries[0]?.text || "NO_SUMMARY_DATA"}
                    </div>
                  </section>
                  <section>
                    <h4 className="text-[11px] font-bold text-void-500 uppercase tracking-[0.4em] mb-6 font-mono">Detected_Aporia</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedSource.questions.map((q, i) => (
                        <div key={i} className="p-6 bg-void-900/50 rounded-2xl border border-white/5 text-sm text-void-300 font-mono">
                          <span className="text-neon-cyan font-bold mr-3">APORIA_{i+1}:</span> {q.text}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center glass border border-white/5 rounded-[48px] bg-black/20 opacity-40">
                <div className="w-16 h-16 border-2 border-void-800 rounded-full flex items-center justify-center mb-6">
                  <div className="w-2 h-2 bg-void-600 rounded-full"></div>
                </div>
                <p className="text-xs font-mono text-void-700 uppercase tracking-[0.6em]">Select_Source_Vector</p>
              </div>
            )}
          </div>
        </div>
      );
      case 'summaries': return <div className="p-12 h-full overflow-y-auto max-w-6xl mx-auto"><SummaryFeed sources={sources} /></div>;
      case 'digest': return <DigestView sources={sources} />;
      case 'notes': return <NoteEditor notes={notes} setNotes={setNotes} />;
      case 'concepts': return <ConceptMap notes={notes} onNoteCreate={addNote} />;
      case 'analysis': return <AnalysisWorkspace notes={notes} />;
      case 'framework': return <PhilosophicalFramework />;
      default: return <Dashboard notes={notes} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#000000] text-void-100 overflow-hidden font-sans select-none">
      <div className="scan-line"></div>
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 h-full overflow-hidden relative">
        {renderView()}
      </main>
    </div>
  );
};

export default App;