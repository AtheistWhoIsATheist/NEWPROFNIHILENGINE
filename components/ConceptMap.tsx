import React, { useMemo, useState } from 'react';
import { Note } from '../types';
import { synthesizeTwoConcepts } from '../services/geminiService';
import { Zap, Loader2, X } from 'lucide-react';

interface ConceptMapProps {
  notes: Note[];
}

export const ConceptMap: React.FC<ConceptMapProps> = ({ notes }) => {
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const constellation = useMemo(() => {
    const size = 300;
    const center = { x: 400, y: 300 };
    
    const vertices = [
      { id: 'M', x: center.x, y: center.y - size },
      { id: 'E', x: center.x + size * Math.cos(-Math.PI/10), y: center.y - size * Math.sin(-Math.PI/10) },
      { id: 'L', x: center.x + size * Math.cos(Math.PI/2 - 4*Math.PI/5), y: center.y - size * Math.sin(Math.PI/2 - 4*Math.PI/5) },
      { id: 'D', x: center.x + size * Math.cos(Math.PI/2 - 6*Math.PI/5), y: center.y - size * Math.sin(Math.PI/2 - 6*Math.PI/5) },
      { id: 'N', x: center.x + size * Math.cos(Math.PI/2 - 8*Math.PI/5), y: center.y - size * Math.sin(Math.PI/2 - 8*Math.PI/5) },
    ];

    const nodes = notes.map(note => {
      let x = center.x;
      let y = center.y;
      const w = note.weights;
      const total = w.M + w.E + w.L + w.D + w.N + 1;
      
      x = (center.x * 1 + vertices[0].x * w.M + vertices[1].x * w.E + vertices[2].x * w.L + vertices[3].x * w.D + vertices[4].x * w.N) / total;
      y = (center.y * 1 + vertices[0].y * w.M + vertices[1].y * w.E + vertices[2].y * w.L + vertices[3].y * w.D + vertices[4].y * w.N) / total;

      return { ...note, x, y };
    });

    // Generate Edges based on shared tags
    const edges: { source: any, target: any }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const sharedTags = nodes[i].tags.filter(tag => nodes[j].tags.includes(tag));
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
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const handleSynthesize = async () => {
    if (selectedNodeIds.length !== 2) return;
    const noteA = notes.find(n => n.id === selectedNodeIds[0]);
    const noteB = notes.find(n => n.id === selectedNodeIds[1]);
    if (!noteA || !noteB) return;

    setIsSynthesizing(true);
    setSynthesis(null);
    try {
      const result = await synthesizeTwoConcepts(noteA, noteB);
      setSynthesis(result);
    } catch (e) {
      setSynthesis("Resonance failure. The collision resulted in pure entropy.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="h-full bg-void-950 p-8 flex flex-col relative overflow-hidden">
      <div className="mb-8 flex justify-between items-start z-10">
        <div>
          <h2 className="text-3xl font-bold text-void-100 font-mono tracking-tighter uppercase">KNOWLEDGE_CONSTELLATION</h2>
          <p className="text-void-500 font-mono text-xs uppercase tracking-widest mt-1">Interactive multi-vector PNT mapping.</p>
        </div>
        <div className="flex space-x-4">
          {selectedNodeIds.length === 2 && (
            <button 
              onClick={handleSynthesize}
              disabled={isSynthesizing}
              className="flex items-center space-x-2 bg-awakening text-white px-4 py-2 rounded font-mono text-xs uppercase tracking-widest hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all animate-pulse"
            >
              {isSynthesizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              <span>Initiate Synthesis</span>
            </button>
          )}
          <div className="grid grid-cols-3 gap-4 text-[9px] font-mono text-void-600 uppercase">
            <div>M: Meaning</div>
            <div>E: Ethics</div>
            <div>L: Language</div>
            <div>D: Despair</div>
            <div>N: Negation</div>
            <div>O: Void</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 border border-void-800 rounded-3xl bg-void-900/20 relative cursor-grab active:cursor-grabbing overflow-hidden">
        <svg viewBox="0 0 800 600" className="w-full h-full">
           <defs>
              <radialGradient id="voidGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
           </defs>
           <circle cx="400" cy="300" r="300" fill="url(#voidGradient)" />

           {/* Pentagon Structure */}
           <path 
             d={`M ${constellation.vertices.map(v => `${v.x},${v.y}`).join(' L ')} Z`} 
             fill="none" 
             stroke="#27272a" 
             strokeWidth="1" 
             strokeDasharray="4 4"
           />
           {constellation.vertices.map(v => (
             <line key={v.id} x1="400" y1="300" x2={v.x} y2={v.y} stroke="#181818" strokeWidth="1" />
           ))}

           {/* Vertex Labels */}
           {constellation.vertices.map(v => (
             <text 
              key={v.id} 
              x={v.x + (v.x > 400 ? 15 : -15)} 
              y={v.y + (v.y > 300 ? 15 : -15)} 
              fill="#52525b" 
              fontSize="14" 
              fontWeight="bold"
              fontFamily="monospace" 
              textAnchor={v.x > 400 ? 'start' : 'end'}
             >
               {v.id}
             </text>
           ))}

           {/* Edges */}
           {constellation.edges.map((edge, i) => (
             <line 
               key={i}
               x1={edge.source.x} y1={edge.source.y}
               x2={edge.target.x} y2={edge.target.y}
               stroke="#a855f7"
               strokeWidth="0.5"
               strokeOpacity="0.2"
             />
           ))}

           {/* Data Nodes */}
           {constellation.nodes.map((node) => {
             const isSelected = selectedNodeIds.includes(node.id);
             return (
               <g key={node.id} className="group cursor-pointer" onClick={() => handleNodeClick(node.id)}>
                 <circle 
                   cx={node.x} 
                   cy={node.y} 
                   r={8 + node.recursiveDepth} 
                   fill={isSelected ? '#ffffff' : (node.hereticalIntensity === 'terminal' ? '#ef4444' : '#a855f7')}
                   fillOpacity={isSelected ? 1 : 0.4}
                   stroke={isSelected ? '#a855f7' : (node.hereticalIntensity === 'terminal' ? '#ef4444' : '#a855f7')}
                   strokeWidth={isSelected ? 3 : 1}
                   className="transition-all duration-300"
                 />
                 {isSelected && (
                    <circle cx={node.x} cy={node.y} r={15 + node.recursiveDepth} fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" />
                 )}
                 <text 
                   x={node.x} 
                   y={node.y - 15 - node.recursiveDepth} 
                   textAnchor="middle" 
                   fill={isSelected ? '#ffffff' : '#e4e4e7'} 
                   fontSize="10"
                   fontWeight={isSelected ? 'bold' : 'normal'}
                   fontFamily="monospace"
                   className={`transition-opacity pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                 >
                   {node.title.toUpperCase()}
                 </text>
               </g>
             );
           })}
        </svg>
      </div>

      {/* Synthesis Modal / Overlay */}
      {synthesis && (
        <div className="absolute inset-0 bg-void-950/90 backdrop-blur-xl flex items-center justify-center p-12 z-50 animate-in fade-in zoom-in duration-300">
          <div className="max-w-2xl w-full bg-void-900 border border-void-800 rounded-3xl p-10 shadow-2xl relative">
            <button onClick={() => setSynthesis(null)} className="absolute top-6 right-6 text-void-500 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-awakening rounded-2xl flex items-center justify-center shadow-lg shadow-awakening/20">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono tracking-tighter text-void-100 uppercase">Vector Synthesis</h3>
                <p className="text-[10px] text-void-500 font-mono tracking-widest uppercase">SPE Generation Success</p>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
               <p className="text-lg leading-relaxed text-void-200 font-serif italic border-l-4 border-awakening pl-6">
                 "{synthesis}"
               </p>
            </div>
            <div className="mt-10 pt-8 border-t border-void-800 flex justify-between items-center text-[10px] font-mono text-void-600 uppercase tracking-widest">
              <span>Entropy Minimized</span>
              <span>Density Critical</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};