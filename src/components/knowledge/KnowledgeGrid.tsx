import React from 'react';
import { Trash2 } from 'lucide-react';
import type { KnowledgeDocument } from '../../types/knowledgeBase';
import { KnowledgeFileIcon } from './KnowledgeFileIcon';
import { KnowledgeStatusBadge } from './KnowledgeStatusBadge';
import { formatDate } from '../../utils/formatters';

interface KnowledgeGridProps {
  documents: KnowledgeDocument[];
  onOpenDetails: (doc: KnowledgeDocument) => void;
  onToggleActive: (doc: KnowledgeDocument, e: React.MouseEvent) => void;
  onDeleteRequest: (doc: KnowledgeDocument) => void;
}

export const KnowledgeGrid: React.FC<KnowledgeGridProps> = ({
  documents,
  onOpenDetails,
  onToggleActive,
  onDeleteRequest,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onOpenDetails(doc)}
          className="p-5 border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-white space-y-3 group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <KnowledgeFileIcon fileType={doc.file_type} sourceType={doc.source_type} />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {doc.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 block">{formatDate(doc.created_at)}</span>
                </div>
              </div>
              <KnowledgeStatusBadge status={doc.status} errorMessage={doc.error_message} />
            </div>

            {doc.description && (
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{doc.description}</p>
            )}

            {Array.isArray(doc.tags) && doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {doc.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="text-[10px] text-slate-400">
              <span className="font-bold text-slate-700">{doc.chunk_count || 0}</span> chunks •{' '}
              <span className="font-bold text-slate-700">{doc.word_count || 0}</span> words
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => onToggleActive(doc, e)}
                className={`relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  doc.is_active ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    doc.is_active ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>

              <button
                onClick={() => onDeleteRequest(doc)}
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
