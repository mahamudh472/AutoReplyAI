import React from 'react';
import { formatFileSize } from '../../utils/formatters';

interface KnowledgeStatsOverviewProps {
  totalDocs: number;
  activeDocs: number;
  totalChunks: number;
  totalWords: number;
  totalBytes: number;
}

export const KnowledgeStatsOverview: React.FC<KnowledgeStatsOverviewProps> = ({
  totalDocs,
  activeDocs,
  totalChunks,
  totalWords,
  totalBytes,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800 font-outfit">Knowledge Base Overview</h3>

      <div className="space-y-3 text-xs leading-normal">
        <div className="flex justify-between py-1 items-center border-b border-slate-100 pb-2">
          <span className="text-slate-400">Total Documents</span>
          <span className="text-slate-800 font-bold">{totalDocs}</span>
        </div>
        <div className="flex justify-between py-1 items-center border-b border-slate-100 pb-2">
          <span className="text-slate-400">Active in AI Context</span>
          <span className="text-emerald-600 font-bold">{activeDocs}</span>
        </div>
        <div className="flex justify-between py-1 items-center border-b border-slate-100 pb-2">
          <span className="text-slate-400">Indexed Vectors / Chunks</span>
          <span className="text-slate-800 font-bold">{totalChunks.toLocaleString()}</span>
        </div>
        <div className="flex justify-between py-1 items-center border-b border-slate-100 pb-2">
          <span className="text-slate-400">Total Indexed Words</span>
          <span className="text-slate-800 font-bold">{totalWords.toLocaleString()}</span>
        </div>
        <div className="flex justify-between py-1 items-center">
          <span className="text-slate-400">Total File Size</span>
          <span className="text-slate-800 font-bold">{formatFileSize(totalBytes) || '0 B'}</span>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
        Documents are converted to semantic embeddings and searched dynamically when customers send messages.
      </p>
    </div>
  );
};
