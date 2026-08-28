import React, { useState, useEffect } from 'react';
import { X, Edit3, Trash2, ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';
import type { KnowledgeDocument, UpdateKnowledgeDocumentPayload } from '../../types/knowledgeBase';
import { KnowledgeFileIcon } from './KnowledgeFileIcon';
import { KnowledgeStatusBadge } from './KnowledgeStatusBadge';
import { formatFileSize, formatDateTime } from '../../utils/formatters';

interface KnowledgeDetailDrawerProps {
  document: KnowledgeDocument | null;
  onClose: () => void;
  onSaveEdit: (id: string, updates: UpdateKnowledgeDocumentPayload) => Promise<any>;
  onDeleteRequest: (doc: KnowledgeDocument) => void;
}

export const KnowledgeDetailDrawer: React.FC<KnowledgeDetailDrawerProps> = ({
  document,
  onClose,
  onSaveEdit,
  onDeleteRequest,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (document) {
      setEditTitle(document.title);
      setEditDescription(document.description || '');
      setEditTags(Array.isArray(document.tags) ? [...document.tags] : []);
      setEditCategory(document.metadata?.category || 'general');
      setEditIsActive(document.is_active);
      setIsEditing(false);
    }
  }, [document]);

  if (!document) return null;

  const addTag = () => {
    const trimmed = editTagInput.trim().replace(/^#/, '').toLowerCase();
    if (trimmed && !editTags.includes(trimmed)) {
      setEditTags([...editTags, trimmed]);
    }
    setEditTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setIsSaving(true);
    try {
      await onSaveEdit(document.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        tags: editTags,
        metadata: {
          ...(document.metadata || {}),
          category: editCategory,
        },
        is_active: editIsActive,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <KnowledgeFileIcon fileType={document.file_type} sourceType={document.source_type} />
            <div>
              <h3 className="text-base font-bold text-slate-850 font-outfit line-clamp-1">
                {document.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <KnowledgeStatusBadge status={document.status} errorMessage={document.error_message} />
                <span className="text-[10px] text-slate-400">ID: {document.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Chunks</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block">{document.chunk_count || 0}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Words</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block">{document.word_count || 0}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Source</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block uppercase">{document.source_type}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Size</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                {formatFileSize(document.file_size) || 'Text'}
              </span>
            </div>
          </div>

          {/* Indexing Error Alert */}
          {document.status === 'failed' && document.error_message && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                Indexing Error
              </span>
              <p>{document.error_message}</p>
            </div>
          )}

          {/* Editable Fields / Metadata */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Document Metadata</h4>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:text-blue-700 cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Info
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 text-xs font-semibold hover:text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-white border border-slate-200 rounded-xl">
                    {editTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-500 hover:text-blue-800 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={editTagInput}
                      onChange={(e) => setEditTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="bg-transparent text-xs text-slate-800 focus:outline-none flex-1 min-w-[80px]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-slate-700">Active Status</span>
                  <button
                    type="button"
                    onClick={() => setEditIsActive(!editIsActive)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      editIsActive ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        editIsActive ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !editTitle.trim()}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSaving && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {document.description && (
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-600 leading-relaxed">
                    {document.description}
                  </div>
                )}

                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  <div className="p-3 flex justify-between items-center bg-slate-50/50">
                    <span className="text-slate-400 text-[11px]">Active</span>
                    <span
                      className={`font-bold text-[11px] ${
                        document.is_active ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      {document.is_active ? 'Yes (Enabled in AI)' : 'No (Disabled)'}
                    </span>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">File Attached</span>
                    {document.file_url ? (
                      <a
                        href={document.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <span>{document.file_name || 'Download File'}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px]">None (Raw text)</span>
                    )}
                  </div>
                  <div className="p-3 flex justify-between items-center bg-slate-50/50">
                    <span className="text-slate-400 text-[11px]">Created By</span>
                    <span className="text-slate-700 font-semibold text-[11px]">
                      {document.created_by_email || '—'}
                    </span>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">Created At</span>
                    <span className="text-slate-700 font-semibold text-[11px]">
                      {formatDateTime(document.created_at)}
                    </span>
                  </div>
                  <div className="p-3 flex justify-between items-center bg-slate-50/50">
                    <span className="text-slate-400 text-[11px]">Last Indexed</span>
                    <span className="text-slate-700 font-semibold text-[11px]">
                      {formatDateTime(document.indexed_at)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Raw Content Preview */}
          {document.raw_content && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Content Preview</h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                {document.raw_content}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between sticky bottom-0">
          <button
            onClick={() => onDeleteRequest(document)}
            className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Document</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
