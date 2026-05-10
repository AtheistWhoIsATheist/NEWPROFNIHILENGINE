import React from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Library, 
  Network, 
  BarChart3, 
  BookOpen, 
  Zap,
  MessageSquare,
  Package,
  FileText,
  Calendar,
  Flame,
  Database,
  Code2
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'COMMAND_DECK' },
    { id: 'ren_mode', icon: Flame, label: 'REN_MODE' },
    { id: 'chat', icon: MessageSquare, label: 'DIALECTIC_ENGINE' },
    { id: 'research', icon: Zap, label: 'DENSIFICATION' },
    { id: 'vault', icon: Database, label: 'SOURCE_VAULT' },
    { id: 'wiki', icon: Code2, label: 'WIKI_LAYER' },
    { id: 'summaries', icon: FileText, label: 'SUMMARIES' },
    { id: 'digest', icon: Calendar, label: 'TEMPORAL_DIGEST' },
    { id: 'notes', icon: FlaskConical, label: 'LABORATORY' },
    { id: 'concepts', icon: Network, label: 'TOPOLOGY_MAP' },
    { id: 'analysis', icon: BarChart3, label: 'METRICS' },
    { id: 'framework', icon: BookOpen, label: 'AXIOMS' },
  ];

  return (
    <div className="w-64 glass border-r border-void-800 flex flex-col h-full z-50">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <span className="font-mono text-2xl font-bold text-white">Ω</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-void-100 font-mono tracking-widest uppercase">Prof. Nihil</h1>
            <p className="text-[9px] text-void-500 font-mono uppercase tracking-[0.3em]">SYMBIONT_v2.5</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-left transition-all duration-300 group relative ${
                isActive
                  ? 'bg-white/5 text-void-50 border border-white/10'
                  : 'text-void-500 hover:text-void-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${
                isActive 
                  ? (item.id === 'ren_mode' ? 'text-orange-500' : 'text-neon-cyan') 
                  : (item.id === 'ren_mode' ? 'group-hover:text-orange-500' : 'group-hover:text-neon-cyan')
              }`} />
              <span className={`font-mono text-[10px] uppercase tracking-[0.15em] font-medium ${isActive && item.id === 'ren_mode' ? 'text-orange-200' : ''}`}>{item.label}</span>
              {isActive && (
                <div className={`absolute right-3 w-1.5 h-1.5 rounded-full shadow-[0_0_10px] ${item.id === 'ren_mode' ? 'bg-orange-500 shadow-orange-500' : 'bg-neon-cyan shadow-[#22d3ee]'}`}></div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 bg-black/40">
        <div className="flex items-center space-x-3 text-[10px] text-void-500 font-mono">
          <div className="w-2 h-2 rounded-full bg-integration animate-pulse shadow-[0_0_8px_#10b981]"></div>
          <span className="tracking-[0.2em]">OS_INTEGRITY_MAX</span>
        </div>
      </div>
    </div>
  );
};