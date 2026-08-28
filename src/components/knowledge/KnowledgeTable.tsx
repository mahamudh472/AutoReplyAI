import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import type { KnowledgeDocument } from '../../types/knowledgeBase';
import { KnowledgeFileIcon } from './KnowledgeFileIcon';
import { KnowledgeStatusBadge } from './KnowledgeStatusBadge';
import { formatDate, formatFileSize } from '../../utils/formatters';

interface KnowledgeTableProps {
  documents: KnowledgeDocument[];
  activeDocs: number;
  indexedDocs: number;
  onOpenDetails: (doc: KnowledgeDocument) => void;
  onToggleActive: (doc: KnowledgeDocument, e: React.MouseEvent) => void;
  onDeleteRequest: (doc: KnowledgeDocument) => void;
}

export const KnowledgeTable: React.FC<KnowledgeTableProps> = ({
  documents,
  activeDocs,
  indexedDocs,
  onOpenDetails,
  onToggleActive,
  onDeleteRequest,
}) => {
  return (
    <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 bg-slate-50/40 font-bold">
              <th className="p-4 uppercase tracking-wider text-[10px]">Document</th>
              <th className="p-4 uppercase tracking-wider text-[10px]">Status</th>
              <th className="p-4 uppercase tracking-wider text-[10px]">Stats</th>
              <th className="p-4 uppercase tracking-wider text-[10px]">Tags</th>
              <th className="p-4 uppercase tracking-wider text-[10px]">Active</th>
              <th className="p-4 text-right uppercase tracking-wider text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
            {documents.map((doc) => (
              <tr
                key={doc.id}
                onClick={() => onOpenDetails(doc)}
                className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
              >
                {/* Name & Source */}
                <td className="p-4">
                  <div className="flex items-start gap-3">
                    <KnowledgeFileIcon fileType={doc.file_type} sourceType={doc.source_type} />
                    <div className="truncate max-w-[220px]">
                      <span className="font-bold text-slate-800 truncate block leading-snug group-hover:text-blue-600 transition-colors">
                        {doc.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                        {doc.file_name && <span>{doc.file_name}</span>}
                        {doc.file_size ? <span>• {formatFileSize(doc.file_size)}</span> : null}
                        <span>• {formatDate(doc.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <KnowledgeStatusBadge status={doc.status} errorMessage={doc.error_message} />
                </td>

                {/* Stats */}
                <td className="p-4">
                  <div className="text-[11px] space-y-0.5">
                    <span className="text-slate-700 font-semibold block">{doc.chunk_count || 0} chunks</span>
                    <span className="text-[10px] text-slate-400 block">
                      {doc.word_count?.toLocaleString() || 0} words
                    </span>
                  </div>
                </td>

                {/* Tags */}
                <td className="p-4">
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {Array.isArray(doc.tags) && doc.tags.length > 0 ? (
                      doc.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-semibold"
                        >
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-300 text-[10px]">—</span>
                    )}
                    {Array.isArray(doc.tags) && doc.tags.length > 3 && (
                      <span className="text-[9px] text-slate-400 font-bold">+{doc.tags.length - 3}</span>
                    )}
                  </div>
                </td>

                {/* Active Toggle */}
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={(e) => onToggleActive(doc, e)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      doc.is_active ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                    title={doc.is_active ? 'Active (used in AI context)' : 'Inactive (disabled)'}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        doc.is_active ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </td>

                {/* Actions */}
                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onOpenDetails(doc)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      title="View / Edit Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteRequest(doc)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-3 bg-slate-50/40 border-t border-slate-100 text-xs text-slate-400 font-medium flex justify-between items-center">
        <span>
          Showing {documents.length} document{documents.length !== 1 ? 's' : ''}
        </span>
        <span>
          Active: {activeDocs} • Indexed: {indexedDocs}
        </span>
      </div>
    </div>
  );
};
