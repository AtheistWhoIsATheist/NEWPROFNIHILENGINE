import React from 'react';
import { Source } from '../types';
import { Link, FileText, Video, Tag, Clock, ChevronRight } from 'lucide-react';

interface LibraryBrowserProps {
  sources: Source[];
  onSelect: (source: Source) => void;
}

export const LibraryBrowser: React.FC<LibraryBrowserProps> = ({ sources, onSelect }) => {
  const safeSources = sources || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold font-mono text-void-400 uppercase tracking-widest">Library_Index</h2>
        <span className="text-[10px] font-mono text-void-600">{safeSources.length} OBJECTS_MAPPED</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {safeSources.map(source => {
          const Icon = source.type === 'video' ? Video : source.type === 'pdf' ? FileText : Link;
          return (
            <div
              key={source.id}
              onClick={() => onSelect(source)}
              className="bg-void-900/50 border border-void-800/50 p-4 rounded-xl hover:bg-void-900 hover:border-void-700 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-void-950 rounded-lg flex items-center justify-center border border-void-800">
                    <Icon className="w-5 h-5 text-void-500 group-hover:text-awakening transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-void-200 truncate max-w-xs">{source.title}</h3>
                    <div className="flex items-center space-x-3 mt-1 text-[10px] text-void-600 font-mono">
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(source.createdAt).toLocaleDateString()}</span>
                      <span className="uppercase">{source.type}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-void-700 group-hover:text-void-400" />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {(source.tags || []).slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-void-950 text-void-500 rounded text-[9px] font-mono border border-void-800">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        {safeSources.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-void-900 rounded-2xl">
            <p className="text-xs font-mono text-void-700 uppercase tracking-widest">Library_Void</p>
          </div>
        )}
      </div>
    </div>
  );
};