
import React, { useState } from 'react';
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
import { Note, Source } from './types';

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Cioran: The Heights of Despair',
    content: 'Only those who have known the void of being can appreciate the fullness of nothingness.',
    phase: 'collapse',
    hereticalIntensity: 'radical',
    recursiveDepth: 1,
    weights: { M: 2, E: 1, L: 4, D: 9, N: 6, O: 3 },
    metrics: { DQ: 3, EE: 2, AI: 3, TRP: 1 },
    tags: ['pessimism', 'void'],
    aporiaMarkers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aiAnalysis: 'Terminal D-axis alignment.',
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

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard notes={notes} />;
      case 'chat':
        return <ChatInterface />;
      case 'research':
        return <ResearchHub />;
      case 'library':
        return (
          <div className="p-8 h-full overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <KnowledgeIngestion onSourceAdded={handleSourceAdded} />
              <LibraryBrowser sources={sources} onSelect={setSelectedSource} />
            </div>
            <div className="lg:col-span-2">
              {selectedSource ? (
                <div className="bg-void-900 border border-void-800 p-8 rounded-2xl animate-in fade-in duration-300">
                  <div className="flex justify-between items-start mb-8">
                    <h2 className="text-3xl font-bold text-void-100 font-mono tracking-tighter">{selectedSource.title}</h2>
                    <button onClick={() => setSelectedSource(null)} className="text-void-500 hover:text-white font-mono text-xs uppercase">Close_Viewer</button>
                  </div>
                  <div className="space-y-8">
                    <section>
                      <h4 className="text-[10px] font-bold text-void-500 uppercase tracking-widest mb-4 font-mono">Synthesized_Summary</h4>
                      <div className="bg-void-950 p-6 rounded-xl border border-void-800 font-serif italic text-void-300 leading-relaxed">
                        {selectedSource.summaries[0]?.text}
                      </div>
                    </section>
                    <section>
                      <h4 className="text-[10px] font-bold text-void-500 uppercase tracking-widest mb-4 font-mono">Extracted_Aporia</h4>
                      <div className="space-y-2">
                        {selectedSource.questions.map((q, i) => (
                          <div key={i} className="p-3 bg-void-950 rounded border border-void-800 text-xs text-void-400 font-mono">
                            Q_{i+1}: {q.text} (APORIA: {q.aporiaLevel})
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-center items-center justify-center border border-void-900 rounded-2xl bg-void-900/10">
                   <p className="text-xs font-mono text-void-700 uppercase tracking-[0.5em]">Awaiting_Selection</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'summaries':
        return (
          <div className="p-8 h-full overflow-y-auto max-w-5xl mx-auto">
             <SummaryFeed sources={sources} />
          </div>
        );
      case 'digest':
        return <DigestView sources={sources} />;
      case 'notes':
        return <NoteEditor notes={notes} setNotes={setNotes} />;
      case 'concepts':
        return <ConceptMap notes={notes} />;
      case 'analysis':
        return <AnalysisWorkspace notes={notes} />;
      case 'framework':
        return <PhilosophicalFramework />;
      default:
        return <Dashboard notes={notes} />;
    }
  };

  return (
    <div className="flex h-screen bg-void-950 text-void-100 overflow-hidden font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 h-full overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
