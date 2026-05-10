import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line as DreiLine } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Disc, X, Sparkles } from 'lucide-react';
import { Note } from '../types';
import { graphData, CustomGraphNode, CustomGraphEdge } from '../services/graphData';

interface CosmicGraphProps {
  notes?: Note[];
  onSynthesize?: (nodeId: string) => void;
}

function VoidMaterial({ voidQuotient }: { voidQuotient: number; type: string }) {
  const color = voidQuotient >= 0.75 ? 0x00e5ff
              : voidQuotient >= 0.50 ? 0xbd00ff
              : voidQuotient >= 0.25 ? 0xff9500
              : 0xe0e0e0;
  
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      const time = clock.elapsedTime;
      const baseIntensity = 0.15 + voidQuotient * 0.3;
      const breathPhase = 0.85 + Math.sin(time * 0.5 * Math.PI) * 0.15;
      materialRef.current.emissiveIntensity = baseIntensity * breathPhase;
    }
  });

  return (
    <meshStandardMaterial
      ref={materialRef}
      color={color}
      metalness={0.3}
      roughness={0.4}
      emissive={color}
    />
  );
}

const baseScale = (type: string, props: any) => {
  switch(type) {
    case 'THINKER': return 0.5 + Math.log2((props.quote_count || 1) + 1) * 0.3;
    case 'QUOTE':   return 0.15 + (props.void_resonance || 0.5) * 0.25;
    case 'THEME':   return 0.3 + Math.log2((props.quote_count || 1) + 1) * 0.15;
    case 'CLAIM':   return 0.2;
    default:        return 0.2;
  }
};

const NodeMesh = ({ node, onClick, isSelected, isMatched }: { node: CustomGraphNode, onClick: () => void, isSelected: boolean, isMatched: boolean }) => {
  const scale = baseScale(node.type, node.properties);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  useFrame(({ camera }) => {
    if (meshRef.current) {
      const camPos = camera.position;
      const nodePos = meshRef.current.position;
      const dist = camPos.distanceTo(nodePos);
      const threshold = node.type === 'THINKER' ? 25 : node.type === 'QUOTE' ? 15 : 20;
      setShowLabel(dist < threshold || hovered || isSelected || isMatched);
    }
  });

  const voidQuotient = node.properties.void_quotient ?? 0.5;

  return (
    <group position={[node.position.x * 2, node.position.y * 2, node.position.z * 2]}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        {node.type === 'THINKER' && <icosahedronGeometry args={[scale, 1]} />}
        {node.type === 'QUOTE' && <octahedronGeometry args={[scale, 0]} />}
        {node.type === 'THEME' && <torusGeometry args={[scale, 0.04, 16, 64]} />}
        {(node.type === 'CLAIM' || (node.type !== 'THINKER' && node.type !== 'QUOTE' && node.type !== 'THEME')) && <tetrahedronGeometry args={[scale, 0]} />}
        <VoidMaterial voidQuotient={voidQuotient} type={node.type} />
      </mesh>
      
      {(isSelected || isMatched) && (
        <mesh>
          <sphereGeometry args={[scale * 1.5, 32, 32]} />
          <meshBasicMaterial color={isMatched ? 0x2dd4bf : 0xffffff} transparent opacity={0.2} wireframe />
        </mesh>
      )}

      {showLabel && (
        <Html center zIndexRange={[100, 0]}>
          <div className={`px-2 py-1 bg-black/80 font-mono text-[10px] rounded border whitespace-nowrap ${isMatched ? 'border-neon-cyan text-neon-cyan' : isSelected ? 'border-white text-white' : 'border-void-700 text-void-300'}`}>
            {node.properties.label || node.id}
          </div>
        </Html>
      )}
    </group>
  );
};

const Edges = ({ nodes, edges }: { nodes: CustomGraphNode[], edges: CustomGraphEdge[] }) => {
  return (
    <group>
      {edges.map((edge, i) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (!sourceNode || !targetNode) return null;

        const start = [sourceNode.position.x * 2, sourceNode.position.y * 2, sourceNode.position.z * 2] as [number, number, number];
        const end = [targetNode.position.x * 2, targetNode.position.y * 2, targetNode.position.z * 2] as [number, number, number];
        
        switch (edge.type) {
          case 'RESONANCE':
            const mid = [
              (start[0] + end[0]) / 2 + 1,
              (start[1] + end[1]) / 2 + 1,
              (start[2] + end[2]) / 2 + 1
            ];
            const curve = new THREE.QuadraticBezierCurve3(
              new THREE.Vector3(...start),
              new THREE.Vector3(...mid),
              new THREE.Vector3(...end)
            );
            return (
              <mesh key={i}>
                <tubeGeometry args={[curve, 20, 0.02, 8, false]} />
                <meshBasicMaterial color={0x00e5ff} transparent opacity={(edge.score || 0.5) * 0.8} />
              </mesh>
            );
          case 'TENSION':
            return (
              <DreiLine
                key={i}
                points={[start, end]}
                color={0xff9500}
                dashed
                dashScale={10}
                transparent
                opacity={0.4 + (edge.score || 0.5) * 0.4}
                lineWidth={1.5}
              />
            );
          case 'ATTRIBUTION':
          default:
            return (
              <DreiLine
                key={i}
                points={[start, end]}
                color={0x888888}
                transparent
                opacity={0.08}
                lineWidth={1}
              />
            );
        }
      })}
    </group>
  );
};

function CameraRig() {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame(({ camera }) => {
     if (lightRef.current) {
        lightRef.current.position.copy(camera.position);
     }
  });
  return <pointLight ref={lightRef} color={0x00e5ff} intensity={0.6} distance={80} />;
}

export const CosmicGraph: React.FC<CosmicGraphProps> = ({ notes, onSynthesize }) => {
  const [selectedNode, setSelectedNode] = useState<CustomGraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const allNodes = useMemo(() => {
    let combined = [...graphData.nodes];
    if (notes) {
      notes.forEach(note => {
        if (!combined.find(n => n.id === note.id)) {
          const type = note.tags?.includes('theme') ? 'THEME' : 'THINKER';
          combined.push({
            id: note.id,
            type,
            position: { x: Math.random() * 20 - 10, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10 },
            properties: { label: note.title, void_quotient: 0.5 }
          });
        }
      });
    }
    return combined;
  }, [notes]);

  const allEdges = useMemo(() => {
    let combined = [...graphData.edges];
    if (notes) {
      notes.forEach(note => {
        if (!combined.find(e => e.source === note.id || e.target === note.id)) {
          combined.push({
            source: 'THINKER_emile_cioran',
            target: note.id,
            type: 'RESONANCE',
            score: 0.5
          });
        }
      });
    }
    return combined;
  }, [notes, allNodes]);

  const filteredNodes = allNodes.filter(n => !activeFilter || n.type === activeFilter);
  const filteredEdges = allEdges.filter(e => filteredNodes.some(n => n.id === e.source) && filteredNodes.some(n => n.id === e.target));

  return (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden" onPointerMissed={() => setSelectedNode(null)}>
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <color attach="background" args={[0x050505]} />
        <fogExp2 attach="fog" color={0x050505} density={0.035} />
        
        <ambientLight color={0x0a0a12} intensity={0.4} />
        <CameraRig />
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          rotateSpeed={0.5} 
          zoomSpeed={0.8} 
          minDistance={5} 
          maxDistance={200} 
        />
        
        <Edges nodes={filteredNodes} edges={filteredEdges} />
        <group>
          {filteredNodes.map(n => {
            const isMatched = searchQuery !== '' && (n.properties.label || n.id).toLowerCase().includes(searchQuery.toLowerCase());
            const isSelected = selectedNode?.id === n.id;
            return (
              <NodeMesh 
                key={n.id} 
                node={n} 
                onClick={() => setSelectedNode(n)} 
                isSelected={isSelected}
                isMatched={isMatched}
              />
            );
          })}
        </group>
      </Canvas>

      <div className="absolute top-[env(safe-area-inset-top,24px)] left-[env(safe-area-inset-left,24px)] z-10 w-[340px] pointer-events-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-[2rem] p-6 space-y-6">
          <div>
            <div className="text-xs font-bold tracking-[0.4em] text-neon-cyan uppercase flex items-center gap-2">
              <Disc className="w-4 h-4 animate-spin-slow" />
              Nihiltheism
            </div>
            <div className="text-xl font-serif italic text-void-300 mt-1">Cosmic Knowledge Graph</div>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-void-400" />
              <input
                type="text"
                placeholder="Locate Entity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-void-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan transition-all min-h-[44px]"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['All', 'THINKER', 'THEME', 'QUOTE', 'CLAIM'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveFilter(cat === 'All' ? null : cat)}
                  className={`flex-auto py-2 px-3 rounded-lg border text-xs font-mono uppercase transition-all min-h-[40px]
                    ${(activeFilter === cat || (!activeFilter && cat === 'All')) ? 'bg-white/20 border-white/40 text-white' : 'bg-void-900/50 border-white/10 text-void-400 hover:text-white hover:border-white/20'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between text-xs font-mono text-void-500">
            <span>NODES: {filteredNodes.length}</span>
            <span>EDGES: {filteredEdges.length}</span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute right-[env(safe-area-inset-right,24px)] top-[env(safe-area-inset-top,24px)] z-20 w-[400px] pointer-events-auto max-h-[85vh] overflow-y-auto"
          >
            <div className="glass-card rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
              <div className="p-6 relative">
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-6 right-6 text-void-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full bg-void-900/40"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <h2 className="text-3xl font-serif text-white mb-2 pr-12">{selectedNode.properties?.label || selectedNode.id}</h2>
                <div className="text-xs font-mono uppercase tracking-[0.2em] mb-6 flex flex-wrap gap-3 items-center text-neon-cyan">
                  <span>{selectedNode.type}</span>
                  {selectedNode.properties?.quote_count !== undefined && (
                    <>
                      <span className="text-void-500">/</span>
                      <span className="text-white/60">Quotes: {selectedNode.properties.quote_count}</span>
                    </>
                  )}
                  {selectedNode.properties?.void_quotient !== undefined && (
                    <>
                       <span className="text-void-500">/</span>
                       <span className="text-white/60">Void: {selectedNode.properties.void_quotient}</span>
                    </>
                  )}
                </div>
                
                <div className="text-sm font-mono text-void-200 leading-relaxed space-y-4">
                   <div className="bg-black/50 p-4 rounded-xl border border-white/5 whitespace-pre-wrap overflow-x-auto">
                     {JSON.stringify(selectedNode.properties, null, 2)}
                   </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 flex justify-between items-center border-t border-white/5">
                <button 
                  onClick={() => onSynthesize && onSynthesize(selectedNode.id)}
                  className="w-full py-3 bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan rounded-xl font-mono text-xs uppercase tracking-widest hover:bg-neon-cyan/20 transition-colors active:scale-[0.98] flex justify-center items-center gap-2 min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4" /> Deep Synthesize
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
