import React from 'react';
import { RefreshCw, FileText, Upload } from 'lucide-react';
import type { Organization } from '../../types/organization';

interface KnowledgeHeaderProps {
  currentOrg?: Organization;
  indexedDocs: number;
  totalDocs: number;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenTextModal: () => void;
  onOpenUploadModal: () => void;
}

export const KnowledgeHeader: React.FC<KnowledgeHeaderProps> = ({
  currentOrg,
  indexedDocs,
  totalDocs,
  refreshing,
  onRefresh,
  onOpenTextModal,
  onOpenUploadModal,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 flex-shrink-0">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-850 font-outfit">
            Knowledge Base
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold">
            {indexedDocs} / {totalDocs} Indexed
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Store documents, policies, and FAQs to power accurate context retrieval for your AI auto-replies.
        </p>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Refresh Knowledge Base"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
          <span className="h-4 w-4 bg-blue-600 rounded text-white flex items-center justify-center text-[9px] font-bold">
            {currentOrg?.name?.charAt(0) || 'A'}
          </span>
          <span className="max-w-[120px] truncate">{currentOrg?.name || 'Organization'}</span>
        </div>

        <button
          onClick={onOpenTextModal}
          className="px-3.5 py-2 bg-white border border-blue-200 hover:border-blue-400 text-blue-600 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
        >
          <FileText className="h-4 w-4" />
          <span>Add Text</span>
        </button>

        <button
          onClick={onOpenUploadModal}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>
    </div>
  );
};
