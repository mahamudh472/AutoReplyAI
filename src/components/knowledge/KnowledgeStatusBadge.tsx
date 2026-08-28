import React from 'react';
import { CheckCircle2, RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import type { DocumentStatus } from '../../types/knowledgeBase';

interface KnowledgeStatusBadgeProps {
  status: DocumentStatus;
  errorMessage?: string | null;
}

export const KnowledgeStatusBadge: React.FC<KnowledgeStatusBadgeProps> = ({ status, errorMessage }) => {
  switch (status) {
    case 'indexed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          Indexed
        </span>
      );
    case 'processing':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold">
          <RefreshCw className="h-3 w-3 text-blue-500 animate-spin" />
          Processing
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold">
          <Clock className="h-3 w-3 text-amber-500" />
          Pending
        </span>
      );
    case 'failed':
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold cursor-pointer"
          title={errorMessage || 'Indexing failed'}
        >
          <AlertTriangle className="h-3 w-3 text-rose-500" />
          Failed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
          {status}
        </span>
      );
  }
};
