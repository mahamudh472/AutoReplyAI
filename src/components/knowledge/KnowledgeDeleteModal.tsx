import React from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import type { KnowledgeDocument } from '../../types/knowledgeBase';

interface KnowledgeDeleteModalProps {
  document: KnowledgeDocument | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export const KnowledgeDeleteModal: React.FC<KnowledgeDeleteModalProps> = ({
  document,
  isDeleting,
  onCancel,
  onConfirm,
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-scale-up">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Trash2 className="h-6 w-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-slate-850 font-outfit">Delete Document</h3>
          <p className="text-xs text-slate-500">
            Are you sure you want to delete <strong className="text-slate-800">{document.title}</strong>? This will
            permanently remove its vector embeddings and associated files.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isDeleting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
