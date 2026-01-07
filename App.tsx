
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ResearchResult from './components/ResearchResult';
import { performResearch } from './services/gemini';
import { getMemory, saveMemoryItems, clearMemory } from './services/memory';
import { MemoryItem, ResearchSession, AgentStatus } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'research' | 'memory' | 'agents'>('research');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ResearchSession | null>(null);
  const [memory, setMemory] = useState<MemoryItem[]>([]);
  const [agents, setAgents] = useState<AgentStatus[]>([
    { id: '1', name: 'Analyst', status: 'idle', lastAction: 'Waiting for task' },
    { id: '2', name: 'Browser', status: 'idle', lastAction: 'Checking network' },
    { id: '3', name: 'Indexer', status: 'idle', lastAction: 'Monitoring context' }
  ]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMemory(getMemory());
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    setResults(null);
    setSearchHistory(prev => [query, ...prev].slice(0, 5));

    setAgents(prev => prev.map(a => ({ ...a, status: 'working', lastAction: 'Analyzing query...' })));

    try {
      const pastContext = memory.map(m => m.content).join(". ").slice(0, 1000);
      const session = await performResearch(query, pastContext);
      
      setResults(session);
      
      if (session.extractedMemory.length > 0) {
        const updatedMemory = saveMemoryItems(session.extractedMemory, query);
        setMemory(updatedMemory);
      }

      setAgents(prev => prev.map(a => ({ ...a, status: 'completed', lastAction: 'Research task finished' })));
    } catch (err) {
      console.error(err);
      setAgents(prev => prev.map(a => ({ ...a, status: 'error', lastAction: 'Task failed' })));
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearMemory = () => {
    if (confirm("Are you sure you want to clear your cognitive memory block?")) {
      clearMemory();
      setMemory([]);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-gray-100">
      <Sidebar 
        memoryItems={memory} 
        onClearMemory={handleClearMemory} 
        activeView={activeView} 
        onViewChange={setActiveView} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-950/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Astra Core 1.0</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isSearching ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-[10px] text-gray-400 font-mono">
                {isSearching ? 'PROCESSING' : 'STABLE'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-2">
              {agents.map(agent => (
                <div 
                  key={agent.id}
                  title={`${agent.name}: ${agent.lastAction}`}
                  className={`w-7 h-7 rounded-full border-2 border-gray-950 flex items-center justify-center text-[10px] font-bold ${
                    agent.status === 'working' ? 'bg-indigo-600 animate-pulse' : 'bg-gray-800'
                  }`}
                >
                  {agent.name[0]}
                </div>
              ))}
            </div>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth">
          {activeView === 'research' && (
            <>
              {!results && !isSearching && (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8 mt-20">
                  <div className="w-20 h-20 bg-indigo-600/20 rounded-3xl flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <h1 className="text-4xl font-bold text-white">What should we explore today?</h1>
                  <p className="text-gray-400 text-lg">Astra utilizes multi-agent consensus and persistent memory to provide the most accurate research possible.</p>
                  
                  <div className="w-full flex flex-wrap gap-2 justify-center">
                    {[
                      'สรุปข่าว AI ล่าสุด', 
                      'Explain Quantum Supremacy', 
                      'ที่เที่ยวญี่ปุ่นยอดฮิต 2024', 
                      'Benefits of Rust programming',
                      'ประวัติศาสตร์กรุงศรีอยุธยา'
                    ].map(suggestion => (
                      <button 
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-sm text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isSearching && (
                <div className="h-full flex flex-col items-center justify-center space-y-8 mt-20">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-indigo-600/20 rounded-full animate-ping" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-medium text-white">Astra is researching...</p>
                    <p className="text-gray-500 animate-pulse">Consulting global indices and memory blocks</p>
                  </div>
                </div>
              )}

              {results && !isSearching && (
                <ResearchResult session={results} />
              )}
            </>
          )}

          {activeView === 'memory' && (
            <div className="max-w-5xl mx-auto py-8">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-white">Cognitive Memory System</h2>
                <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/30">
                  {memory.length} ENTRIES
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memory.map(item => (
                  <div key={item.id} className="p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all flex flex-col group">
                    <p className="text-gray-300 leading-relaxed mb-6 flex-1 italic">"{item.content}"</p>
                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono uppercase">
                        <span>Source: {item.source.slice(0, 20)}...</span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-1">
                        {item.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-[9px] rounded-md">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {memory.length === 0 && (
                  <div className="col-span-full py-20 text-center text-gray-600">
                    Your cognitive memory is currently empty. Start a research session to populate it.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'agents' && (
            <div className="max-w-4xl mx-auto py-8">
              <h2 className="text-3xl font-bold text-white mb-2">Multi-Agent Control</h2>
              <p className="text-gray-500 mb-10">Monitor and configure your persistent research swarm.</p>
              
              <div className="space-y-4">
                {agents.map(agent => (
                  <div key={agent.id} className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                        agent.status === 'working' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {agent.name[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{agent.name} Agent</h3>
                        <p className="text-sm text-gray-500">{agent.lastAction}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        agent.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        agent.status === 'working' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 animate-pulse' :
                        'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>
                        {agent.status}
                      </div>
                      <button className="p-2 text-gray-500 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent absolute bottom-0 left-0 right-0">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto relative group">
            <div className={`absolute inset-0 bg-indigo-600/20 blur-xl transition-opacity duration-300 opacity-0 group-focus-within:opacity-100`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Deep research or web automation prompt..."
              className="w-full h-16 bg-gray-900/90 border border-gray-800 rounded-2xl px-6 pr-32 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all relative z-10"
            />
            <div className="absolute right-3 top-3 bottom-3 flex items-center gap-2 z-20">
              <button
                type="button"
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="h-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-bold px-6 rounded-xl transition-all flex items-center gap-2"
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
                Research
              </button>
            </div>
          </form>
          <div className="mt-4 flex justify-center gap-4">
             <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Consensus: ACTIVE</span>
             <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Privacy: SHIELDED</span>
             <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Model: GEMINI-3-PRO</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
