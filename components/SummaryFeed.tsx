
import React from 'react';
import { Source, Entity, Summary } from '../types';
import { Quote, User, Brain, BookOpen } from 'lucide-react';

interface SummaryFeedProps {
  sources: Source[];
}

export const SummaryFeed: React.FC<SummaryFeedProps> = ({ sources }) => {
  const allSummaries = sources.flatMap(s => s.summaries).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const allEntities = sources.flatMap(s => s.entities);

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-lg font-bold font-mono text-void-400 uppercase tracking-widest mb-6">Discovery_Feed</h2>
        <div className="space-y-6">
          {allSummaries.map(summary => {
            const source = sources.find(s => s.id === summary.sourceId);
            return (
              <div key={summary.id} className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-awakening/20 rounded-r-xl p-6 bg-void-900/30 border border-void-800">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-void-500 mb-4 uppercase tracking-widest">
                  <BookOpen className="w-3 h-3" />
                  <span>RES_SCORE: {summary.resonanceScore}</span>
                  <span>•</span>
                  <span className="text-void-300">{source?.title}</span>
                </div>
                <p className="text-void-200 text-sm leading-relaxed font-serif italic">
                  "{summary.text}"
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold font-mono text-void-400 uppercase tracking-widest mb-6">Entity_Cloud</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allEntities.map(entity => (
            <div key={entity.id} className="bg-void-950 p-4 border border-void-800 rounded-xl hover:border-awakening/40 transition-all">
              <div className="flex items-center space-x-2 mb-2">
                {entity.type === 'person' ? <User className="w-3 h-3 text-collapse" /> : <Brain className="w-3 h-3 text-awakening" />}
                <span className="text-[10px] font-mono uppercase text-void-500 tracking-tighter">{entity.type}</span>
              </div>
              <h4 className="text-xs font-bold text-void-100 mb-1">{entity.name}</h4>
              <p className="text-[10px] text-void-600 line-clamp-2">{entity.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
