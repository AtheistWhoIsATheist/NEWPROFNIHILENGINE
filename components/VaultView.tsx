import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, FolderUp, DownloadCloud, Database, FileText, CheckCircle, AlertTriangle, Loader2, Archive, Trash2, Cpu } from 'lucide-react';
import { SourceRecord, addSource, getAllSources, getSourceByHash, calculateSHA256, batchPutSources, initDb } from '../services/vaultService';
import { ingestSourceToWiki } from '../services/geminiService';
import { initializeWikiDefaults, putWikiPage, appendToLog } from '../services/wikiService';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const VaultView: React.FC = () => {
  const [sources, setSources] = useState<SourceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [exportingToZip, setExportingToZip] = useState(false);
  const [ingestingToWikiId, setIngestingToWikiId] = useState<string | null>(null);
  const [importLogs, setImportLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    setLoading(true);
    try {
      const all = await getAllSources();
      setSources(all.sort((a, b) => new Date(b.imported_at).getTime() - new Date(a.imported_at).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIngestToWiki = async (source: SourceRecord) => {
    if (ingestingToWikiId) return;
    setIngestingToWikiId(source.source_id);
    log(`Starting AI Wiki Ingestion for: ${source.original_filename}`);
    
    try {
      await initializeWikiDefaults();
      const wikiData = await ingestSourceToWiki(source.content, source.original_filename);
      
      const pageId = `${wikiData.category}/${wikiData.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${source.sha256.substring(0, 4)}.md`;
      
      await putWikiPage({
        id: pageId,
        title: wikiData.title,
        category: wikiData.category,
        content: wikiData.markdown,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source_count: 1,
        tags: wikiData.tags || []
      });

      await appendToLog(`ingest | ${source.original_filename} -> ${pageId}`);
      log(`Success! Created wiki page: ${pageId}`);
    } catch (err: any) {
      console.error(err);
      log(`Ingestion AI Error for ${source.original_filename}: ${err.message}`);
    } finally {
      setIngestingToWikiId(null);
    }
  };

  const clearVault = async () => {
    if (!window.confirm("Are you sure you want to delete all imported sources from the vault? This cannot be undone.")) return;
    try {
      const db = await initDb();
      await db.clear('sources');
      setSources([]);
      setImportLogs(['Vault cleared.']);
    } catch (err) {
      console.error(err);
      alert('Failed to clear vault.');
    }
  };

  const log = (msg: string) => {
    setImportLogs(prev => [...prev, msg]);
  };

  const handleFolderUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processFiles = async (files: FileList | File[]) => {
    setImporting(true);
    setImportLogs([]);
    const batchId = crypto.randomUUID();
    let importedCount = 0;
    let duplicateCount = 0;
    
    log(`Starting import batch: ${batchId}`);
    
    const recordsToPut: SourceRecord[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Filter out non-text files quickly
      if (!['md', 'markdown', 'txt', 'csv', 'json'].includes(extension) && !file.type.startsWith('text/')) {
        log(`Skipped ${file.name} (Unsupported file type)`);
        continue;
      }

      try {
        const text = await file.text();
        const sha256 = await calculateSHA256(text);
        
        // Check duplicate
        const existing = await getSourceByHash(sha256);
        if (existing) {
          log(`Duplicate skipped: ${file.name} (Hash: ${sha256.substring(0, 8)})`);
          duplicateCount++;
          continue;
        }

        const path = (file as any).webkitRelativePath || file.name;

        const record: SourceRecord = {
          source_id: `src:${sha256}`,
          original_path: path,
          original_filename: file.name,
          extension,
          mime_guess: file.type || 'text/plain',
          encoding: 'UTF-8',
          size_bytes: file.size,
          sha256,
          imported_at: new Date().toISOString(),
          modified_at_source: new Date(file.lastModified).toISOString(),
          import_batch_id: batchId,
          status: 'imported',
          error: null,
          content: text
        };

        recordsToPut.push(record);
        importedCount++;
        log(`Imported: ${path}`);
      } catch (err: any) {
         log(`Error importing ${file.name}: ${err.message}`);
      }
    }

    if (recordsToPut.length > 0) {
      await batchPutSources(recordsToPut);
    }

    log(`Batch complete. Imported: ${importedCount}, Duplicates: ${duplicateCount}`);
    setImporting(false);
    loadSources();
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const exportJSON = () => {
    const exportData = JSON.stringify(sources, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-manifest-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMarkdownVault = () => {
    // Creates a massive single Markdown file of all content for LLM Context Pack
    let mdContent = `# Knowledge Vault Export\nGenerated: ${new Date().toISOString()}\n\n`;
    
    sources.forEach(src => {
      mdContent += `\n---\n## File: ${src.original_path}\n`;
      mdContent += `- **Source ID**: ${src.source_id}\n`;
      mdContent += `- **Hash**: ${src.sha256}\n`;
      mdContent += `- **Imported**: ${src.imported_at}\n\n`;
      mdContent += `\`\`\`${src.extension}\n`;
      mdContent += src.content;
      mdContent += `\n\`\`\`\n\n`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-content-pack-${new Date().toISOString()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportZIP = async () => {
    setExportingToZip(true);
    try {
      const zip = new JSZip();
      
      sources.forEach(src => {
        // Handle paths, default to root if empty
        const safePath = src.original_path || src.original_filename;
        zip.file(safePath, src.content);
      });
      
      // Add the manifest as well just in case they want metadata
      const manifestData = sources.map(({ content, ...metadata }) => metadata);
      zip.file('vault-manifest.json', JSON.stringify(manifestData, null, 2));

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `vault-archive-${new Date().toISOString()}.zip`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate ZIP Export.');
    } finally {
      setExportingToZip(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-8 rounded-[32px] border border-white/5 relative overflow-hidden group flex flex-col xl:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-mono text-white flex items-center space-x-3">
              <Database className="w-6 h-6 text-neon-cyan" />
              <span className="tracking-[0.2em] uppercase">Source Vault Layer</span>
            </h2>
            <button 
              onClick={clearVault} 
              className="text-void-500 hover:text-red-400 p-2 rounded-lg transition-colors border border-transparent hover:border-red-900/50 hover:bg-red-900/10"
              title="Clear entire vault"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm font-mono text-void-400 mb-8 max-w-xl">
            The immutable root of your knowledge. Everything here is pure, pristine, and fully yours. All insights are derived from this layer.
          </p>
          
          <div 
            className="border-2 border-dashed border-white/10 hover:border-neon-cyan/50 transition-colors rounded-2xl p-8 mb-6 text-center cursor-pointer relative bg-black/20 group"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleFolderUpload}
          >
            {importing ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="w-10 h-10 animate-spin text-neon-cyan mb-4" />
                <p className="font-mono text-xs tracking-widest text-void-300">INGESTING BATCH...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 transition-transform group-hover:-translate-y-1">
                <FolderUp className="w-12 h-12 text-void-500 mb-4 group-hover:text-neon-cyan transition-colors" />
                <p className="font-mono text-sm tracking-widest text-void-200 mb-2">DRAG AND DROP FILES OR FOLDERS</p>
                <p className="font-mono text-xs text-void-500">Supports .md, .txt, .csv, .json (Recursive Folder Parsing)</p>
              </div>
            )}
            <input 
              type="file" 
              multiple 
              // @ts-ignore - webkitdirectory is non-standard but works in modern browsers
              webkitdirectory="true" 
              directory="true"
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFilesChange} 
            />
          </div>
        </div>

        <div className="xl:w-80 flex flex-col space-y-4">
          <div className="bg-void-900 p-6 rounded-2xl border border-white/5 h-full">
            <h3 className="font-mono text-xs tracking-widest text-void-300 mb-6 uppercase">Vault Status</h3>
            <div className="space-y-4 mb-8">
              <div>
                <p className="font-mono text-[10px] text-void-500 mb-1">TOTAL SOURCES</p>
                <p className="font-mono text-2xl text-void-200">{sources.length}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-void-500 mb-1">TOTAL SIZE</p>
                <p className="font-mono text-2xl text-void-200">{Math.round(sources.reduce((acc, src) => acc + src.size_bytes, 0) / 1024)} <span className="text-sm text-void-500">KB</span></p>
              </div>
            </div>
            
            <h3 className="font-mono text-xs tracking-widest text-void-300 mb-4 uppercase">Bulk Export</h3>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={exportZIP}
                disabled={exportingToZip || sources.length === 0}
                className="px-4 py-3 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-black border border-neon-cyan/20 text-xs font-mono rounded-xl flex items-center justify-between transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center space-x-2">
                  <Archive className="w-4 h-4" />
                  <span>ZIP EXPORT (MD/TXT)</span>
                </span>
                {exportingToZip && <Loader2 className="w-4 h-4 animate-spin" />}
              </button>
              
              <button 
                onClick={exportMarkdownVault}
                disabled={sources.length === 0}
                className="px-4 py-3 bg-void-800 text-white hover:bg-white hover:text-black border border-white/5 text-xs font-mono rounded-xl flex items-center space-x-2 transition-all shadow-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>CONTEXT PACK (SINGLE MD)</span>
              </button>

              <button 
                onClick={exportJSON}
                disabled={sources.length === 0}
                className="px-4 py-3 bg-void-900 border border-white/10 hover:border-white/30 text-void-200 text-xs font-mono rounded-xl transition-all w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                MANIFEST ONLY (JSON)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-[32px] border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-mono text-sm tracking-widest text-void-300 uppercase flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Vault Contents (Immutable)
          </h3>
          <span className="font-mono text-xs text-void-500">{sources.length} items</span>
        </div>
        
        {importLogs.length > 0 && (
          <div className="mb-6 bg-black/60 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-void-300 max-h-40 overflow-y-auto">
            {importLogs.map((log, i) => (
               <div key={i} className="mb-1">{`> ${log}`}</div>
            ))}
          </div>
        )}

        {loading ? (
           <div className="flex justify-center p-8"><Loader2 className="animate-spin text-neon-cyan w-6 h-6" /></div>
        ) : sources.length === 0 ? (
           <div className="text-center p-12 border-2 border-dashed border-white/5 rounded-2xl bg-black/20">
             <Database className="w-10 h-10 text-void-600 mx-auto mb-4" />
             <p className="font-mono text-sm tracking-widest text-void-400 mb-2 uppercase">Vault is empty</p>
             <p className="font-mono text-xs text-void-600">Import files to start building your knowledge base.</p>
           </div>
        ) : (
          <div className="space-y-2">
            {sources.slice(0, 100).map(source => (
              <div key={source.source_id} className="flex items-center justify-between p-3 rounded-xl bg-void-900 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer">
                <div className="flex items-center space-x-4 overflow-hidden">
                  {source.status === 'imported' ? <CheckCircle className="w-4 h-4 text-emerald-500/70 shrink-0 group-hover:text-emerald-400 transition-colors" /> : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-void-200 truncate pr-4">{source.original_path}</p>
                    <p className="font-mono text-[10px] text-void-500 mt-1 flex space-x-3">
                      <span>{new Date(source.imported_at).toLocaleString()}</span>
                      <span>•</span>
                      <span>{Math.round(source.size_bytes / 1024)} KB</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleIngestToWiki(source); }}
                    disabled={ingestingToWikiId === source.source_id}
                    className="p-1 px-3 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/20 border border-neon-cyan/10 rounded font-mono text-[10px] flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                  >
                    {ingestingToWikiId === source.source_id ? <Loader2 className="w-3 h-3 animate-spin"/> : <Cpu className="w-3 h-3"/>}
                    <span>INGEST</span>
                  </button>
                  <div className="font-mono text-[10px] text-void-600 bg-black px-2 py-1 flex items-center space-x-2 rounded shrink-0">
                    <span className="uppercase">{source.extension}</span>
                    <span className="opacity-30">|</span>
                    <span>{source.sha256.substring(0, 8)}</span>
                  </div>
                </div>
              </div>
            ))}
            {sources.length > 100 && (
              <div className="text-center p-4 border border-dashed border-white/10 rounded-xl mt-4 font-mono text-xs text-void-500">
                + {sources.length - 100} more files
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

