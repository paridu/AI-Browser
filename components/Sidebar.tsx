
import React from 'react';
import { MemoryItem } from '../types';

interface SidebarProps {
  memoryItems: MemoryItem[];
  onClearMemory: () => void;
  activeView: 'research' | 'memory' | 'agents';
  onViewChange: (view: 'research' | 'memory' | 'agents') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ memoryItems, onClearMemory, activeView, onViewChange }) => {
  return (
    <div className="w-64 h-full bg-gray-950 border-r border-gray-800 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-indigo-400">ASTRA</h1>
      </div>

      <nav className="space-y-1 mb-auto">
        <button
          onClick={() => onViewChange('research')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'research' ? 'bg-indigo-600/10 text-indigo-400' : 'text-gray-400 hover:bg-gray-900'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Research
        </button>
        <button
          onClick={() => onViewChange('memory')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'memory' ? 'bg-indigo-600/10 text-indigo-400' : 'text-gray-400 hover:bg-gray-900'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Cognitive Memory
        </button>
        <button
          onClick={() => onViewChange('agents')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'agents' ? 'bg-indigo-600/10 text-indigo-400' : 'text-gray-400 hover:bg-gray-900'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Agents
        </button>
      </nav>

      <div className="mt-8 border-t border-gray-800 pt-6">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Memories</h3>
        <div className="space-y-3 px-3 overflow-hidden">
          {memoryItems.slice(0, 5).map(item => (
            <div key={item.id} className="text-xs text-gray-400 truncate hover:text-gray-300 cursor-default transition-colors">
              • {item.content}
            </div>
          ))}
          {memoryItems.length === 0 && (
            <div className="text-xs text-gray-600 italic">No memories yet...</div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button 
          onClick={onClearMemory}
          className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          Clear Memory System
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
