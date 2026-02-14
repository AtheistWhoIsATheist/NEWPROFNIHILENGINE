import React, { useState } from 'react';
import { Link, FileText, Video, Plus, Loader2, Sparkles } from 'lucide-react';
import { Source, SourceType } from '../types';
import { ingestSource } from '../services/geminiService';

interface KnowledgeIngestionProps {
  onSourceAdded: (source: Source) => void;
}

export const KnowledgeIngestion: React.FC<KnowledgeIngestionProps> = ({ onSourceAdded }) => {
  const [type, setType] = useState<SourceType>('link');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState<{ base64: string; mimeType: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setFileData({ base64, mimeType: file.type });
        setInputValue(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const sourceId = crypto.randomUUID();
      const partialSource: Partial<Source> = {
        id: sourceId,
        type,
        title: inputValue,
        url: type === 'link' || type === 'video' ? inputValue : undefined,
        content: type === 'text' ? inputValue : undefined,
        base64Data: fileData?.base64,
        mimeType: fileData?.mimeType,
        status: 'pending'
      };

      const result = await ingestSource(partialSource);
      
      const fullSource: Source = {
        ...partialSource,
        id: sourceId,
        title: result.title || inputValue,
        status: 'indexed',
        entities: result.entities || [],
        summaries: result.summaries || [],
        questions: result.questions || [],
        tags: result.tags || [],
        createdAt: new Date().toISOString()
      } as Source;

      onSourceAdded(fullSource);
      setInputValue('');
      setFileData(null);
    } catch (err) {
      console.error(err);
      // Fallback for visual continuity if API fails
      const fallbackSource: Source = {
         id: crypto.randomUUID(),
         type,
         title: inputValue + ' (Offline/Error)',
         url: type === 'link' ? inputValue : undefined,
         status: 'failed',
         entities: [],
         summaries: [{id: 'err', sourceId: 'err', text: 'Ingestion failed due to connectivity or API limits.', resonanceScore: 0, createdAt: new Date().toISOString()}],
         questions: [],
         tags: ['error', 'unindexed'],
         createdAt: new Date().toISOString()
      };
      onSourceAdded(fallbackSource);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 rounded-[32px] mb-10 shadow-2xl relative overflow-hidden group border border-white/5">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles className="w-24 h-24 text-neon-cyan" />
      </div>

      <h2 className="text-xl font-bold font-mono text-white mb-8 flex items-center space-x-4">
        <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
        <span className="tracking-[0.2em] uppercase">Ingestion_Protocol</span>
      </h2>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { id: 'link', icon: Link, label: 'LINK' },
          { id: 'pdf', icon: FileText, label: 'PDF' },
          { id: 'video', icon: Video, label: 'VEO' },
          { id: 'text', icon: FileText, label: 'RAW' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setType(t.id as SourceType); setInputValue(''); setFileData(null); }}
            className={`flex flex-col items-center justify-center space-y-2 py-4 rounded-2xl font-mono text-[9px] transition-all border ${
              type === t.id ? 'bg-white/10 border-neon-cyan text-white shadow-neon-cyan/20' : 'bg-transparent border-white/5 text-void-500 hover:text-void-300 hover:border-white/20'
            }`}
          >
            <t.icon className="w-4 h-4" />
            <span className="tracking-widest">{t.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {type === 'pdf' ? (
          <div className="relative h-32 glass border-2 border-dashed border-white/5 rounded-2xl flex flex-center items-center justify-center group hover:border-neon-cyan transition-all">
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="text-center">
              <FileText className="w-10 h-10 mx-auto mb-3 text-void-600 group-hover:text-neon-cyan" />
              <p className="text-[10px] text-void-500 font-mono tracking-widest">{inputValue || "BROWSE_PDF_VECTOR"}</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-black/40 border border-white/5 text-void-100 p-5 rounded-2xl font-mono text-xs focus:outline-none focus:border-neon-cyan transition-all placeholder-void-700"
              placeholder={type === 'text' ? "INPUT_PHILOSOPHICAL_STRING..." : "INPUT_TARGET_URL..."}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !inputValue}
          className={`w-full py-5 rounded-2xl font-mono font-bold tracking-[0.3em] text-[10px] uppercase flex items-center justify-center space-x-4 transition-all ${
            loading ? 'bg-void-900 text-void-700 border border-white/5' : 'bg-white text-black hover:bg-neon-cyan hover:text-white active:scale-[0.98]'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>CRAWLING_VOID...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>COMMIT_INGESTION</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};