import React from 'react';
import { Skull, Eye, Heart } from 'lucide-react';

export const PhilosophicalFramework: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto bg-void-950">
       <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-void-100 font-mono mb-4 tracking-tight">NIHILTHEISTIC FRAMEWORK</h1>
        <p className="text-void-400 max-w-2xl mx-auto">The architecture of collapse-awakening-integration. A structural methodology for navigating the void.</p>
      </div>

      <div className="space-y-12">
        <section className="relative pl-8 border-l-2 border-collapse">
           <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-collapse flex items-center justify-center">
             <Skull className="w-4 h-4 text-white" />
           </div>
           <h2 className="text-2xl font-bold text-collapse mb-4 font-mono uppercase">Phase 1: Collapse</h2>
           <p className="text-void-300 leading-relaxed mb-4">
             The confrontation with meaninglessness. This is not merely sadness, but an ontological stripping.
             The "Collapse" phase is characterized by a high index of <strong>Existential Dread</strong> and recognition of the <strong>Absurd</strong>.
             It involves the failure of defense mechanisms (Zapffe) and the onset of profound boredom (Schopenhauer).
           </p>
           <div className="bg-void-900 p-4 rounded-lg border border-void-800">
             <h4 className="text-xs font-bold text-void-500 uppercase mb-2">Key Thinkers</h4>
             <p className="text-sm text-void-300">Cioran, Sartre, Schopenhauer</p>
           </div>
        </section>

        <section className="relative pl-8 border-l-2 border-awakening">
           <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-awakening flex items-center justify-center">
             <Eye className="w-4 h-4 text-white" />
           </div>
           <h2 className="text-2xl font-bold text-awakening mb-4 font-mono uppercase">Phase 2: Awakening</h2>
           <p className="text-void-300 leading-relaxed mb-4">
             The recognition of the void as generative. Nothingness is re-contextualized not as 'absence', but as 'plenum'.
             <strong>Transcendental Yearning</strong> peaks here. The dread of Phase 1 transmutes into awe.
             This matches the "Introvertive Mysticism" of Stace or the "Gelassenheit" of Heidegger.
           </p>
           <div className="bg-void-900 p-4 rounded-lg border border-void-800">
             <h4 className="text-xs font-bold text-void-500 uppercase mb-2">Key Thinkers</h4>
             <p className="text-sm text-void-300">Heidegger, Meister Eckhart, Nishitani</p>
           </div>
        </section>

        <section className="relative pl-8 border-l-2 border-integration">
           <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-integration flex items-center justify-center">
             <Heart className="w-4 h-4 text-white" />
           </div>
           <h2 className="text-2xl font-bold text-integration mb-4 font-mono uppercase">Phase 3: Integration</h2>
           <p className="text-void-300 leading-relaxed mb-4">
             Provisional meaning creation. One returns to the world of forms, but with the knowledge of the void.
             The "Courage to Be" (Tillich) allows one to act despite the lack of absolute ground.
             This is the ethical turn of Nihiltheism.
           </p>
           <div className="bg-void-900 p-4 rounded-lg border border-void-800">
             <h4 className="text-xs font-bold text-void-500 uppercase mb-2">Key Thinkers</h4>
             <p className="text-sm text-void-300">Tillich, Camus, Levinas</p>
           </div>
        </section>
      </div>
    </div>
  );
};