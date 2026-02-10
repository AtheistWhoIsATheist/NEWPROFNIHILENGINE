
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
  Calendar
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Command Deck' },
    { id: 'chat', icon: MessageSquare, label: 'Dialectic Engine' },
    { id: 'research', icon: Zap, label: 'Densification' },
    { id: 'library', icon: Package, label: 'Library' },
    { id: 'summaries', icon: FileText, label: 'Summaries' },
    { id: 'digest', icon: Calendar, label: 'Digest' },
    { id: 'notes', icon: FlaskConical, label: 'Laboratory' },
    { id: 'concepts', icon: Network, label: 'Topology' },
    { id: 'analysis', icon: BarChart3, label: 'Metrics' },
    { id: 'framework', icon: BookOpen, label: 'Framework' },
  ];

  return (
    <div className="w-64 bg-void-900 border-r border-void-800 flex flex-col h-full">
      <div className="p-6 border-b border-void-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-void-950 via-awakening to-collapse rounded-xl flex items-center justify-center shadow-lg shadow-awakening/20 border border-void-700">
            <span className="font-mono text-xl font-bold text-white">Ω</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-void-100 font-mono tracking-tighter">PROF. NIHIL</h1>
            <p className="text-[10px] text-void-500 font-mono uppercase tracking-[0.2em]">SPE ENGINE v0.1</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 group relative ${
                isActive
                  ? 'bg-void-800 text-void-50 border border-void-700'
                  : 'text-void-500 hover:bg-void-800/50 hover:text-void-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-awakening' : 'text-void-600'}`} />
              <span className="font-mono text-[10px] uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-awakening rounded-full shadow-[0_0_8px_#a855f7]"></div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-void-800 bg-void-950/50">
        <div className="flex items-center space-x-2 text-[10px] text-void-600 font-mono">
          <div className="w-2 h-2 rounded-full bg-integration animate-pulse"></div>
          <span className="tracking-widest text-[9px]">SYSTEM_STABLE</span>
        </div>
      </div>
    </div>
  );
};
