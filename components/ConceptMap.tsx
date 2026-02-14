import React, { useMemo, useState } from 'react';
import { Note } from '../types';
import { synthesizeConcepts } from '../services/geminiService';
import { Zap, Loader2, X, Info, Target, Network, Layers, Save } from 'lucide-react';

interface ConceptMapProps {
  notes: Note[];
  onNoteCreate: (note: Note) => void;
}

export const ConceptMap: React.FC<ConceptMapProps> = ({ notes, onNoteCreate }) => {
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const constellation = useMemo(() => {
    const size = 300;
    const center = { x: 500, y: 350 };
    
    // Pentagonal Anchor Points
    const vertices = [
      { id: 'M', x: center.x, y: center.y - size },
      { id: 'E', x: center.x + size * Math.cos(-Math.PI/10), y: center.y - size * Math.sin(-Math.PI/10) },
      { id: 'L', x: center.x + size * Math.cos(Math.PI/2 - 4*Math.PI/5), y: center.y - size * Math.sin(Math.PI/2 - 4*Math.PI/5) },
      { id: 'D', x: center.x + size * Math.cos(Math.PI/2 - 6*Math.PI/5), y: center.y - size * Math.sin(Math.PI/2 - 6*Math.PI/5) },
      { id: 'N', x: center.x + size * Math.cos(Math.PI/2 - 8*Math.PI/5), y: center.y - size * Math.sin(Math.PI/2 - 8*Math.PI/5) },
    ];

    const nodes = (notes || []).map((note, idx) => {
      let x = center.x;
      let y = center.y;
      const w = note.weights || { M: 0, E: 0, L: 0, D: 0, N: 0, O: 0 };
      
      const total = (w.M + w.E + w.L + w.D + w.N) || 1;
      
      // Weight-based positioning
      x = (center.x * 2 + vertices[0].x * w.M + vertices[1].x * w.E + vertices[2].x * w.L + vertices[3].x * w.D + vertices[4].x * w.N) / (total + 2);
      y = (center.y * 2 + vertices[0].y * w.M + vertices[1].y * w.E + vertices[2].y * w.L + vertices[3].y * w.D + vertices[4].y * w.N) / (total + 2);

      // Recursive offset based on index to prevent stacking
      x += (Math.sin(idx * 1.5) * 50);
      y += (Math.cos(idx * 2.1) * 50);

      return { ...note, x, y };
    });

    const edges: { source: any, target: any }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // Safe tag access
        const tagsA = nodes[i].tags || [];
        const tagsB = nodes[j].tags || [];
        const sharedTags = tagsA.filter(tag => tagsB.includes(tag));
        if (sharedTags.length > 0) {
          edges.push({ source: nodes[i], target: nodes[j] });
        }
      }
    }

    return { vertices, nodes, edges };
  }, [notes]);

  const handleNodeClick = (id: string) => {
    setSelectedNodeIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      // Allow unlimited selections for complex synthesis
      return [...prev, id];
    });
  };

  const handleSynthesize = async () => {
    if (selectedNodeIds.length < 2) return;
    const selectedNotes = notes.filter(n => selectedNodeIds.includes(n.id));
    if (selectedNotes.length === 0) return;

    setIsSynthesizing(true);
    setSynthesis(null);
    try {
      const result = await synthesizeConcepts(selectedNotes);
      setSynthesis(result);
    } catch (e) {
      console.error(e);
      setSynthesis("SYNERGY_COLLAPSE: Critical entropic noise detected during synthesis. The Void refused the connection.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSaveSynthesis = () => {
    if (!synthesis) return;
    
    const selectedNotes = notes.filter(n => selectedNodeIds.includes(n.id));
    const title = `SYNTHESIS: ${selectedNotes.map(n => n.title.split(':')[0]).join(' + ').slice(0, 40)}`;
    
    // Convert markdown-like syntax to basic HTML for the NoteEditor
    const formattedContent = synthesis
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');

    // Robust tag extraction using reduce to ensure string[] type and avoid 'unknown' inference
    const allTags: string[] = selectedNotes.reduce((acc: string[], n) => [...acc, ...(n.tags || [])], []);
    const uniqueTags = Array.from(new Set(['synthesis', 'emergent', ...allTags]));

    const newNote: Note = {
      id: crypto.randomUUID(),
      title: title,
      content: `<h3>Recursive Synthesis</h3><p>${formattedContent}</p>`,
      phase: 'synthesis',
      hereticalIntensity: 'radical',
      recursiveDepth: (Math.max(...selectedNotes.map(n => n.recursiveDepth), 0) + 1),
      weights: { M: 5, E: 5, L: 5, D: 5, N: 5, O: 5 },
      metrics: { DQ: 5, EE: 5, AI: 8, TRP: 8 },
      tags: uniqueTags.slice(0, 8),
      aporiaMarkers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCanon: false,
      aiAnalysis: 'Emergent property detected. Synthesis validated.'
    };

    onNoteCreate(newNote);
    setSynthesis(null);
    setSelectedNodeIds([]);
  };

  return (
    <div className="h-full bg-[#000000] flex flex-col relative overflow-hidden">
      {/* Nebula Backdrop */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-cyan/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="p-12 flex justify-between items-start z-10 relative pointer-events-none">
        <div className="pointer-events-auto">
          <h2 className="text-4xl font-bold text-white font-mono tracking-tighter uppercase mb-2">Spreading_Nodes</h2>
          <p className="text-void-500 font-mono text-[10px] uppercase tracking-[0.5em]">Topology_Sync_v2.0 // Neural_Lattice</p>
          <p className="text-void-600 font-mono text-[10px] mt-2">SELECTED_NODES: {selectedNodeIds.length}</p>
        </div>
        
        <div className="flex space-x-4 items-center pointer-events-auto">
          {selectedNodeIds.length >= 2 && (
            <button 
              onClick={handleSynthesize}
              disabled={isSynthesizing}
              className="group flex items-center space-x-3 bg-white text-black px-8 py-3 rounded-full font-mono text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:bg-neon-cyan hover:text-white transition-all active:scale-95 animate-pulse cursor-pointer"
            >
              {isSynthesizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
              <span>Recursive_Synthesis ({selectedNodeIds.length})</span>
            </button>
          )}
          <div className="glass px-6 py-3 rounded-2xl flex space-x-6 text-[9px] font-mono text-void-400 uppercase tracking-[0.2em] border border-white/5 shadow-2xl">
            <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-neon-cyan mr-2 shadow-[0_0_8px_#22d3ee]"></div> MEANING</span>
            <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-neon-purple mr-2 shadow-[0_0_8px_#a855f7]"></div> ETHICS</span>
            <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-neon-teal mr-2 shadow-[0_0_8px_#2dd4bf]"></div> VOID</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <svg viewBox="0 0 1000 700" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
           <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
              </linearGradient>
           </defs>
           
           {/* Connection Lines (Lattice) */}
           {constellation.edges.map((edge, i) => (
             <line 
               key={`edge-${i}`}
               x1={edge.source.x} y1={edge.source.y}
               x2={edge.target.x} y2={edge.target.y}
               stroke="url(#linkGradient)"
               strokeWidth="1.5"
               strokeDasharray="4 4"
               className="opacity-30 pointer-events-none"
             />
           ))}

           {/* Synthesis Visual Web */}
           {selectedNodeIds.length >= 2 && constellation.nodes
             .filter(n => selectedNodeIds.includes(n.id))
             .map((node, i, arr) => {
               const nextNode = arr[(i + 1) % arr.length];
               return (
                 <line 
                    key={`syn-link-${i}`}
                    x1={node.x} y1={node.y}
                    x2={nextNode.x} y2={nextNode.y}
                    stroke="#fff"
                    strokeWidth="2"
                    filter="url(#glow)"
                    className="animate-pulse pointer-events-none"
                 />
               )
           })}

           {/* Conceptual Nodes */}
           {constellation.nodes.map((node) => {
             const isSelected = selectedNodeIds.includes(node.id);
             return (
               <g key={node.id} className="group cursor-pointer" onClick={() => handleNodeClick(node.id)}>
                 {/* Atmosphere */}
                 <circle 
                   cx={node.x} 
                   cy={node.y} 
                   r={20 + node.recursiveDepth * 5} 
                   fill={isSelected ? '#22d3ee' : '#22d3ee'}
                   fillOpacity={isSelected ? 0.3 : 0.03}
                   className="transition-all duration-700 group-hover:fill-opacity-20"
                 />
                 {/* Core Node */}
                 <circle 
                   cx={node.x} 
                   cy={node.y} 
                   r={6 + node.recursiveDepth} 
                   fill={isSelected ? '#fff' : '#22d3ee'}
                   className="transition-all duration-300 shadow-neon-cyan"
                   filter={isSelected ? "url(#glow)" : ""}
                 />
                 {/* Floating Label */}
                 <text 
                   x={node.x} 
                   y={node.y + 35 + node.recursiveDepth * 2} 
                   textAnchor="middle" 
                   fill={isSelected ? '#fff' : '#52525b'} 
                   fontSize="10"
                   fontWeight="600"
                   fontFamily="monospace"
                   className={`transition-all tracking-widest uppercase pointer-events-none select-none ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 translate-y-[-5px]'}`}
                 >
                   {node.title}
                 </text>
               </g>
             );
           })}
        </svg>
      </div>

      {/* Synthesis Modal Overlay */}
      {synthesis && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl flex items-center justify-center p-12 z-[100] animate-in fade-in zoom-in duration-500">
          <div className="max-w-4xl w-full glass-card rounded-[48px] p-16 shadow-[0_0_100px_rgba(168,85,247,0.1)] relative border border-white/10 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"></div>
            
            <button onClick={() => setSynthesis(null)} className="absolute top-10 right-10 text-void-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full z-10">
              <X className="w-8 h-8" />
            </button>
            
            <div className="flex items-center space-x-8 mb-12 flex-shrink-0">
              <div className="w-20 h-20 bg-neon-cyan rounded-[24px] flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                <Target className="w-10 h-10 text-black" />
              </div>
              <div>
                <h3 className="text-3xl font-bold font-mono tracking-tighter text-white uppercase">Recursive_Synthesis</h3>
                <p className="text-[11px] text-neon-cyan font-mono tracking-[0.4em] uppercase">Third_Term_Emergence_Protocol</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none overflow-y-auto flex-1 pr-6 custom-scrollbar">
               <div className="text-xl leading-[1.8] text-void-100 font-serif border-l-4 border-neon-cyan/40 pl-10 py-2 whitespace-pre-wrap">
                 {synthesis}
               </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[11px] font-mono text-void-600 uppercase tracking-[0.3em] flex-shrink-0">
              <div className="flex items-center space-x-6">
                 <span className="flex items-center"><Info className="w-4 h-4 mr-3 text-neon-cyan" /> SIGNAL_STRENGTH: 0.998</span>
                 <span className="px-4 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">STABLE_GENESIS</span>
              </div>
              
              <button onClick={handleSaveSynthesis} className="flex items-center space-x-2 bg-white text-black px-6 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest hover:bg-neon-cyan hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <Save className="w-4 h-4" />
                <span>Save_To_Lattice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};