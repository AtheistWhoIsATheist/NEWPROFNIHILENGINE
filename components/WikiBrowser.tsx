import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, List, Clock, Edit3, Trash2 } from 'lucide-react';
import { WikiPage, getAllWikiPages, getWikiPage, putWikiPage, deleteWikiPage, initializeWikiDefaults } from '../services/wikiService';
import Markdown from 'react-markdown';

export const WikiBrowser: React.FC = () => {
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    await initializeWikiDefaults();
    const allPages = await getAllWikiPages();
    setPages(allPages.sort((a, b) => b.updated_at.localeCompare(a.updated_at)));
  };

  const handleSelectPage = async (id: string) => {
    setSelectedPageId(id);
    setIsEditing(false);
  };

  const handleEdit = () => {
    const page = pages.find(p => p.id === selectedPageId);
    if (page) {
      setEditContent(page.content);
      setEditTitle(page.title);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (selectedPageId) {
      const page = pages.find(p => p.id === selectedPageId);
      if (page) {
        await putWikiPage({
          ...page,
          title: editTitle,
          content: editContent,
          updated_at: new Date().toISOString()
        });
        setIsEditing(false);
        loadPages();
      }
    }
  };

  const handleCreateNew = async () => {
    const defaultId = `new-page-${Date.now()}.md`;
    await putWikiPage({
      id: defaultId,
      title: 'New Page',
      category: 'uncategorized',
      content: '# New Page\n\nStart typing here...',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source_count: 0,
      tags: []
    });
    await loadPages();
    setSelectedPageId(defaultId);
    setEditTitle('New Page');
    setEditContent('# New Page\n\nStart typing here...');
    setIsEditing(true);
  };

  const selectedPage = pages.find(p => p.id === selectedPageId);

  const filteredPages = pages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar */}
      <div className="w-80 flex flex-col gap-4">
        <div className="glass-card p-4 rounded-3xl border border-white/5 flex flex-col gap-4 max-h-full">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm tracking-widest text-void-300 uppercase">Wiki Pages</h2>
            <button onClick={handleCreateNew} className="p-1 hover:text-neon-cyan transition-colors" title="New Page">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-void-500" />
            <input
              type="text"
              placeholder="Search wiki..."
              className="w-full bg-void-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-void-200 outline-none focus:border-neon-cyan/50 font-mono transition-colors"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredPages.map(page => (
              <div 
                key={page.id}
                onClick={() => handleSelectPage(page.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${selectedPageId === page.id ? 'bg-black/40 border-neon-cyan/30 text-neon-cyan' : 'bg-black/20 border-white/5 hover:border-white/20 text-void-300'}`}
              >
                <div className="font-mono text-xs font-semibold mb-1 truncate">{page.title}</div>
                <div className="flex items-center justify-between font-mono text-[10px] text-void-500">
                  <span className="truncate">{page.id}</span>
                  {(page.id === 'index.md' || page.id === 'log.md') && <span className="bg-void-800 px-1.5 py-0.5 rounded text-void-300">sys</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor/Viewer */}
      <div className="flex-1 glass-card rounded-3xl border border-white/5 overflow-hidden flex flex-col">
        {selectedPage ? (
          <>
            <div className="bg-black/40 p-4 border-b border-white/5 flex justify-between items-center">
              <div>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="bg-transparent font-mono text-lg text-void-200 outline-none border-b border-white/20 focus:border-neon-cyan px-1 py-0.5 w-64"
                  />
                ) : (
                  <h3 className="font-mono text-lg text-void-200">{selectedPage.title}</h3>
                )}
                <div className="font-mono text-[10px] text-void-500 mt-1 flex space-x-4">
                  <span className="flex items-center"><FileText className="w-3 h-3 mr-1"/> {selectedPage.id}</span>
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> Updated: {new Date(selectedPage.updated_at).toLocaleString()}</span>
                </div>
              </div>
              
              <div>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1 font-mono text-xs text-void-400 hover:text-white transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-3 py-1 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded font-mono text-xs hover:bg-neon-cyan hover:text-black transition-all">Save</button>
                  </div>
                ) : (
                  <button onClick={handleEdit} className="p-2 text-void-400 hover:text-white transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 prose prose-invert prose-p:text-void-300 prose-headings:text-void-100 max-w-none prose-a:text-neon-cyan prose-pre:bg-void-900 prose-pre:border prose-pre:border-white/10">
              {isEditing ? (
                <textarea 
                  className="w-full h-full bg-void-900/50 text-void-200 font-mono text-sm p-4 rounded-xl border border-white/10 outline-none focus:border-neon-cyan/50 resize-none min-h-[500px]"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Wiki content (Markdown)..."
                />
              ) : (
                <div className="markdown-body">
                  <Markdown>{selectedPage.content}</Markdown>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-void-500">
             <List className="w-12 h-12 mb-4 opacity-20" />
             <p className="font-mono text-sm tracking-widest uppercase">Select a page or create one</p>
          </div>
        )}
      </div>
    </div>
  );
};
