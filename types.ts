
export interface MemoryItem {
  id: string;
  timestamp: number;
  content: string;
  tags: string[];
  source: string;
}

export interface AgentStatus {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'completed' | 'error';
  lastAction: string;
}

export interface SearchResult {
  title: string;
  snippet: string;
  link: string;
}

export interface ResearchSession {
  id: string;
  query: string;
  answer: string;
  sources: SearchResult[];
  extractedMemory: string[];
  timestamp: number;
}
