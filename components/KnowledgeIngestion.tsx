
import React, { useState } from 'react';
import { Link, FileText, Video, Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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
        title: type === 'link' || type === 'video' ? inputValue : inputValue,
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
        title: result.title,
        status: 'indexed',
        entities: result.entities,
        summaries: result.summaries,
        questions: result.questions,
        tags: result.tags,
        createdAt: new Date().toISOString()
      } as Source;

      onSourceAdded(fullSource);
      setInputValue('');
      setFileData(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-void-900 border border-void-800 p-6 rounded-2xl shadow-2xl mb-8">
      <h2 className="text-xl font-bold font-mono text-void-100 mb-6 flex items-center space-x-3">
        <Plus className="w-5 h-5 text-awakening" />
        <span>INGESTION_MODULE</span>
      </h2>

      <div className="flex space-x-2 mb-6">
        {[
          { id: 'link', icon: Link, label: 'Link' },
          { id: 'pdf', icon: FileText, label: 'PDF' },
          { id: 'video', icon: Video, label: 'Video' },
          { id: 'text', icon: FileText, label: 'Text' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setType(t.id as SourceType); setInputValue(''); setFileData(null); }}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-mono text-xs transition-all ${
              type === t.id ? 'bg-awakening text-white' : 'bg-void-800 text-void-500 hover:bg-void-700'
            }`}
          >
            <t.icon className="w-4 h-4" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'pdf' ? (
          <div className="relative h-32 border-2 border-dashed border-void-800 rounded-xl flex flex-center items-center justify-center group hover:border-awakening transition-colors">
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-void-600 group-hover:text-awakening" />
              <p className="text-xs text-void-500 font-mono">{inputValue || "SELECT_PDF_FILE"}</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-void-950 border border-void-800 text-void-200 p-4 rounded-xl font-mono text-sm focus:outline-none focus:border-awakening transition-all"
              placeholder={type === 'text' ? "INPUT_RAW_TEXT..." : "INPUT_SOURCE_URL..."}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !inputValue}
          className={`w-full py-4 rounded-xl font-mono font-bold tracking-widest text-xs uppercase flex items-center justify-center space-x-3 transition-all ${
            loading ? 'bg-void-800 text-void-600' : 'bg-void-100 text-void-950 hover:bg-white active:scale-95'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>PROCESSING_STREAM...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>EXECUTE_INGESTION</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
