
import React from 'react';
import { ResearchSession } from '../types';

interface ResearchResultProps {
  session: ResearchSession;
}

const ResearchResult: React.FC<ResearchResultProps> = ({ session }) => {
  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 animate-fade-in pb-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white leading-tight">{session.query}</h2>
        <p className="text-sm text-gray-500">Research completed {new Date(session.timestamp).toLocaleTimeString()}</p>
      </div>

      <div className="prose prose-invert prose-indigo max-w-none">
        <div className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
          {session.answer}
        </div>
      </div>

      {session.sources.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L7.04 14.33a2 2 0 002.828 2.828l1.101-1.101m0 0a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Grounding Sources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {session.sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:bg-gray-900 hover:border-indigo-500/50 transition-all group"
              >
                <div className="font-medium text-gray-200 group-hover:text-indigo-400 truncate mb-1">{source.title}</div>
                <div className="text-xs text-gray-500 truncate">{source.link}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {session.extractedMemory.length > 0 && (
        <div className="p-6 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest">Cognitive Extraction</h3>
          </div>
          <ul className="space-y-3">
            {session.extractedMemory.map((mem, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-300">
                <span className="text-indigo-500 mt-1.5">•</span>
                <span>{mem}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResearchResult;
