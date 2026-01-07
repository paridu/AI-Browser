
import { MemoryItem } from "../types";

const STORAGE_KEY = "astra_memory_system";

export const getMemory = (): MemoryItem[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveMemoryItems = (contents: string[], source: string) => {
  const current = getMemory();
  const newItems: MemoryItem[] = contents.map(content => ({
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    content,
    tags: ["auto-extracted"],
    source
  }));
  
  const updated = [...newItems, ...current].slice(0, 100); // Keep last 100 items
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearMemory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
