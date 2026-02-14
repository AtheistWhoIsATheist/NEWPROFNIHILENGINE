import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Tag, Activity, Target, Bold, Italic, List, Link as LinkIcon, Eye, Type, X, Plus, BrainCircuit, Search } from 'lucide-react';
import { Note, AporiaMarker } from '../types';
import { analyzeNoteWithGemini, expandConcept } from '../services/geminiService';

interface NoteEditorProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ notes, setNotes }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [showAporiaLayer, setShowAporiaLayer] = useState(false);
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const [linkSearchTerm, setLinkSearchTerm] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  const contentRef = useRef<HTMLDivElement>(null);
  const activeNote = notes.find(n => n.id === selectedNoteId);

  // Sync content with state when switching notes, but carefully to avoid overwriting user input during re-renders
  useEffect(() => {
    if (activeNote && contentRef.current) {
      // Only force update DOM if the content in state is significantly different
      // This happens when switching notes or when AI updates the content
      if (contentRef.current.innerHTML !== activeNote.content) {
         // To avoid cursor jumping when user types (which triggers this effect due to state update),
         // we ideally check if the document.activeElement is this ref. 
         // However, simple check: if the difference is purely user typing, DOM is ahead of state usually.
         // We simply accept that switching notes forces a refresh.
         // Deep Research updates will also force a refresh.
         if (document.activeElement !== contentRef.current) {
             contentRef.current.innerHTML = activeNote.content;
         } else {
             // If we are focused, we assume the DOM is the authority, UNLESS the state changed from an external source (like AI).
             // Checking if the difference is large might be a heuristic, but for now, we'll let React reconcile
             // or simply rely on the fact that handleContentChange updates state.
             // If we force update innerHTML while typing, cursor jumps.
             // We skip update if focused. 
             // BUT: if AI finishes expanding while we type, we want to see it.
             // Edge case: User types while AI returns.
         }
      }
    }
  }, [selectedNoteId]); // Depend primarily on ID change for hard resets.

  // Separate effect for external updates (AI expansion) to force update even if focused?
  // We'll handle that by explicit action in handleDeepResearch.

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

  const updateActiveNote = (updates: Partial<Note>) => {
    if (!activeNote) return;
    const updatedNote = { ...activeNote, ...updates, updatedAt: new Date().toISOString() };
    setNotes(prev => prev.map(n => n.id === activeNote.id ? updatedNote : n));
    
    // If the update includes content (e.g. from AI), we might need to force the DOM to sync
    if (updates.content && contentRef.current && document.activeElement !== contentRef.current) {
        contentRef.current.innerHTML = updates.content;
    }
  };

  const handleContentChange = () => {
    if (contentRef.current && activeNote) {
      // Direct update of state from DOM
      const html = contentRef.current.innerHTML;
      if (html !== activeNote.content) {
          setNotes(prev => prev.map(n => n.id === activeNote.id ? { ...n, content: html, updatedAt: new Date().toISOString() } : n));
      }
    }
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    handleContentChange();
    if (contentRef.current) contentRef.current.focus();
  };

  const insertLink = (targetId: string, targetTitle: string) => {
    const linkHTML = `<a href="#${targetId}" class="text-neon-cyan underline decoration-dotted hover:text-white transition-colors" contenteditable="false">[[${targetTitle}]]</a>&nbsp;`;
    document.execCommand('insertHTML', false, linkHTML);
    setShowLinkMenu(false);
    setLinkSearchTerm('');
    handleContentChange();
  };

  const handleAnalyze = async () => {
    if (!activeNote || !contentRef.current) return;
    setIsAnalyzing(true);
    try {
      const textContent = contentRef.current.innerText;
      const result = await analyzeNoteWithGemini(textContent);
      
      const newTags = [...new Set([...activeNote.tags, ...(result.tags || [])])];
      
      updateActiveNote({
        weights: result.weights,
        metrics: result.metrics,
        phase: result.phase,
        hereticalIntensity: result.hereticalIntensity,
        tags: newTags,
        aiAnalysis: result.analysis,
        aporiaMarkers: result.aporiaMarkers || [],
        recursiveDepth: activeNote.recursiveDepth // Logic expansion increases depth, analysis just maps it
      });
    } catch (e) {
      console.error("Analysis failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeepResearch = async () => {
    if (!activeNote || !contentRef.current) return;
    setIsExpanding(true);
    try {
        const textContent = contentRef.current.innerText;
        const expandedContent = await expandConcept(activeNote.title, textContent);
        
        // Append expansion
        const newHtml = activeNote.content + `
        <div class="recursive-expansion my-8 p-6 border-l-2 border-neon-purple bg-void-900/30 rounded-r-xl">
           <h3 class="text-neon-purple font-mono text-sm uppercase tracking-widest mb-4">Recursive_Expansion_Layer_${activeNote.recursiveDepth + 1}</h3>
           ${expandedContent}
        </div>
        <br/>
        `;
        
        updateActiveNote({
            content: newHtml,
            recursiveDepth: activeNote.recursiveDepth + 1
        });
        
        // Force DOM update
        if (contentRef.current) contentRef.current.innerHTML = newHtml;

    } catch (e) {
        console.error("Deep research failed", e);
    } finally {
        setIsExpanding(false);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || !activeNote) return;
    if (!activeNote.tags.includes(tagInput.trim())) {
      updateActiveNote({ tags: [...activeNote.tags, tagInput.trim()] });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    if (!activeNote) return;
    updateActiveNote({ tags: activeNote.tags.filter(t => t !== tag) });
  };

  const renderAporiaLayer = () => {
    if (!activeNote) return null;
    let html = activeNote.content;
    
    activeNote.aporiaMarkers.forEach((marker) => {
      if (marker.quote && html.includes(marker.quote)) {
        const color = marker.type === 'paradox' ? 'rgba(168, 85, 247, 0.3)' 
                    : marker.type === 'ineffability' ? 'rgba(34, 211, 238, 0.3)' 
                    : 'rgba(244, 63, 94, 0.3)';
        const borderColor = marker.type === 'paradox' ? '#a855f7' 
                          : marker.type === 'ineffability' ? '#22d3ee' 
                          : '#f43f5e';
        
        const highlight = `<span class="relative group cursor-help border-b-2" style="background-color: ${color}; border-color: ${borderColor}">
          ${marker.quote}
          <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black border border-white/20 rounded-xl text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-mono">
            <strong class="block uppercase mb-1" style="color:${borderColor}">${marker.type} (Lv.${marker.intensity})</strong>
            ${marker.description}
          </span>
        </span>`;
        html = html.replace(marker.quote, highlight);
      }
    });
    
    return <div className="prose prose-invert max-w-none font-serif text-lg leading-relaxed text-void-200" dangerouslySetInnerHTML={{ __html: html }} />;
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
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-void-800 flex justify-between items-center bg-void-950/80 backdrop-blur-md z-10">
            <div className="flex-1 mr-8">
              <input 
                value={activeNote.title}
                onChange={(e) => updateActiveNote({ title: e.target.value })}
                className="bg-transparent text-xl font-bold text-void-100 placeholder-void-700 focus:outline-none w-full font-mono tracking-tight"
                placeholder="GENESIS VECTOR..."
              />
            </div>
            <div className="flex items-center space-x-4">
               <div className="flex items-center bg-void-900 rounded-lg p-1 border border-void-800 mr-4">
                  <button onClick={() => executeCommand('bold')} className="p-2 hover:bg-void-800 rounded text-void-400 hover:text-white transition-colors" title="Bold">
                    <Bold className="w-4 h-4" />
                  </button>
                  <button onClick={() => executeCommand('italic')} className="p-2 hover:bg-void-800 rounded text-void-400 hover:text-white transition-colors" title="Italic">
                    <Italic className="w-4 h-4" />
                  </button>
                  <button onClick={() => executeCommand('insertUnorderedList')} className="p-2 hover:bg-void-800 rounded text-void-400 hover:text-white transition-colors" title="List">
                    <List className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-4 bg-void-800 mx-1"></div>
                  <div className="relative">
                    <button 
                        onClick={() => { setShowLinkMenu(!showLinkMenu); setLinkSearchTerm(''); }} 
                        className={`p-2 rounded text-void-400 hover:text-white transition-colors ${showLinkMenu ? 'bg-void-800 text-white' : 'hover:bg-void-800'}`} 
                        title="Link Note"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    {showLinkMenu && (
                      <div className="absolute top-full right-0 mt-2 w-72 bg-void-950 border border-void-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-3 border-b border-void-800 flex items-center bg-void-900">
                             <Search className="w-3 h-3 text-void-500 mr-2" />
                             <input 
                                autoFocus
                                placeholder="Search nodes..."
                                className="bg-transparent text-xs text-void-200 focus:outline-none w-full placeholder-void-600 font-mono"
                                value={linkSearchTerm}
                                onChange={e => setLinkSearchTerm(e.target.value)}
                             />
                        </div>
                        <div className="p-2 max-h-48 overflow-y-auto">
                          {notes
                             .filter(n => n.id !== activeNote.id && n.title.toLowerCase().includes(linkSearchTerm.toLowerCase()))
                             .map(n => (
                            <button 
                              key={n.id} 
                              onClick={() => insertLink(n.id, n.title)}
                              className="w-full text-left px-3 py-2 text-xs text-void-300 hover:bg-void-800 hover:text-white rounded truncate flex items-center group"
                            >
                              <div className="w-1 h-1 bg-void-600 rounded-full mr-2 group-hover:bg-neon-cyan transition-colors"></div>
                              {n.title}
                            </button>
                          ))}
                          {notes.filter(n => n.id !== activeNote.id && n.title.toLowerCase().includes(linkSearchTerm.toLowerCase())).length === 0 && (
                              <div className="text-center p-4 text-[10px] text-void-600 font-mono">NO_VECTORS_FOUND</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
               </div>

              <button 
                onClick={() => setShowAporiaLayer(!showAporiaLayer)}
                className={`flex items-center space-x-2 px-4 py-2 rounded font-mono text-[10px] uppercase tracking-widest transition-all border ${
                  showAporiaLayer 
                    ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/50' 
                    : 'bg-void-900 text-void-500 border-void-800 hover:border-void-600'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>{showAporiaLayer ? 'Hide Layer' : 'Show Aporia'}</span>
              </button>

              <button 
                onClick={handleDeepResearch}
                disabled={isExpanding || isAnalyzing}
                className={`flex items-center space-x-2 px-6 py-2 rounded font-mono text-[10px] uppercase tracking-widest transition-all ${
                  isExpanding ? 'bg-void-800 text-void-500' : 'bg-white text-black hover:bg-neon-cyan hover:text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                }`}
              >
                <BrainCircuit className={`w-3 h-3 ${isExpanding ? 'animate-spin' : ''}`} />
                <span>{isExpanding ? 'Expanding...' : 'Deep Expand'}</span>
              </button>

              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || isExpanding}
                className={`flex items-center space-x-2 px-6 py-2 rounded font-mono text-[10px] uppercase tracking-widest transition-all ${
                  isAnalyzing ? 'bg-void-800 text-void-500' : 'bg-void-100 text-void-950 hover:bg-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                }`}
              >
                <Sparkles className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Densifying...' : 'Densify'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Editor / Viewer Area */}
            <div className="flex-1 flex flex-col relative bg-void-950">
              {showAporiaLayer ? (
                <div className="flex-1 p-12 overflow-y-auto bg-void-950 selection:bg-neon-purple/20">
                  <div className="max-w-3xl mx-auto">
                     {renderAporiaLayer()}
                  </div>
                </div>
              ) : (
                <div 
                  ref={contentRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleContentChange}
                  className="flex-1 p-12 overflow-y-auto outline-none prose prose-invert max-w-none font-serif text-lg leading-relaxed text-void-200 empty:before:content-[attr(placeholder)] empty:before:text-void-700 focus:bg-void-900/10 transition-colors"
                  placeholder="Capture the spark..."
                  style={{ minHeight: '100%' }}
                />
              )}

              {/* Tag Bar */}
              <div className="px-8 py-4 border-t border-void-800 bg-void-900/20 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-void-600 mr-2" />
                {activeNote.tags.map(tag => (
                  <span key={tag} className="group flex items-center bg-void-900 border border-void-700 text-void-400 px-3 py-1 rounded-full text-[10px] font-mono hover:border-neon-cyan hover:text-neon-cyan transition-colors">
                    #{tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-2 opacity-0 group-hover:opacity-100 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <div className="flex items-center bg-void-900 border border-void-800 rounded-full px-2">
                  <span className="text-void-600 text-xs font-mono ml-1">#</span>
                  <input 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="add_tag"
                    className="bg-transparent border-none focus:outline-none text-[10px] font-mono text-void-300 w-24 py-1 ml-1"
                  />
                  <button onClick={handleAddTag} className="text-void-600 hover:text-white">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Sidebar Stats */}
            <div className="w-80 border-l border-void-800 bg-void-900/20 p-6 overflow-y-auto space-y-8">
              <section>
                <h4 className="text-[10px] font-bold text-void-500 uppercase tracking-[0.2em] mb-4 font-mono">Analysis Feed</h4>
                {activeNote.aiAnalysis ? (
                  <div className="bg-void-900/50 p-4 rounded-xl border border-void-800">
                     <div className="flex items-center space-x-2 mb-3 text-awakening">
                       <Target className="w-3 h-3" />
                       <span className="text-[10px] font-bold font-mono uppercase tracking-widest">SPE Synthesis</span>
                     </div>
                     <p className="text-sm text-void-400 italic font-serif leading-relaxed">
                       "{activeNote.aiAnalysis}"
                     </p>
                  </div>
                ) : (
                  <p className="text-[10px] text-void-700 font-mono italic">No analysis data. Run densification.</p>
                )}
              </section>

              <section>
                <h4 className="text-[10px] font-bold text-void-500 uppercase tracking-[0.2em] mb-4 font-mono">Aporia Markers</h4>
                <div className="space-y-3">
                  {activeNote.aporiaMarkers.length > 0 ? (
                    activeNote.aporiaMarkers.map((m, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-void-950 rounded border border-void-800 hover:border-void-600">
                         <div className={`w-2 h-2 mt-1 rounded-full flex-shrink-0 ${
                            m.type === 'paradox' ? 'bg-neon-purple' : m.type === 'ineffability' ? 'bg-neon-cyan' : 'bg-collapse'
                         }`}></div>
                         <div>
                           <div className="text-[10px] text-void-300 font-bold uppercase font-mono mb-1">{m.type} <span className="text-void-600">Lv.{m.intensity}</span></div>
                           <div className="text-[10px] text-void-500 leading-tight">{m.description}</div>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-void-700 font-mono italic">No aporia detected.</div>
                  )}
                </div>
              </section>

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
                <h4 className="text-[10px] font-bold text-void-500 uppercase tracking-[0.2em] mb-4 font-mono">Topology Weights</h4>
                <div className="space-y-2">
                  {Object.entries(activeNote.weights).map(([key, val]) => (
                    <div key={key} className="flex items-center space-x-3">
                      <span className="text-[10px] font-bold font-mono text-void-400 w-4">{key}</span>
                      <div className="h-1 flex-1 bg-void-800 rounded-full">
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