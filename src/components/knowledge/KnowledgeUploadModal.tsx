import React, { useState, useRef } from 'react';
import { X, Upload, FileText, RefreshCw } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

interface KnowledgeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    file: File;
    title: string;
    description: string;
    category: string;
    tags: string[];
    isActive: boolean;
  }) => Promise<void>;
}

export const KnowledgeUploadModal: React.FC<KnowledgeUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('general');
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [uploadTagInput, setUploadTagInput] = useState('');
  const [uploadIsActive, setUploadIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const addTag = () => {
    const trimmed = uploadTagInput.trim().replace(/^#/, '').toLowerCase();
    if (trimmed && !uploadTags.includes(trimmed)) {
      setUploadTags([...uploadTags, trimmed]);
    }
    setUploadTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setUploadTags(uploadTags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        file: uploadFile,
        title: uploadTitle.trim() || uploadFile.name,
        description: uploadDescription.trim(),
        category: uploadCategory,
        tags: uploadTags,
        isActive: uploadIsActive,
      });
      onClose();
      setUploadFile(null);
      setUploadTitle('');
      setUploadDescription('');
      setUploadTags([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-scale-up">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-850 font-outfit">Upload Document</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload a file to be parsed, chunked, and indexed in the knowledge base.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* File Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
              uploadFile ? 'border-blue-500 bg-blue-50/20' : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".txt,.md,.csv,.json,.pdf,.docx"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setUploadFile(file);
                  if (!uploadTitle) {
                    setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
                  }
                }
              }}
              className="hidden"
            />

            {uploadFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-xs">{uploadFile.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {formatFileSize(uploadFile.size)} • Click to replace file
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">Click to choose file or drag & drop here</p>
                <p className="text-[10px] text-slate-400">Supports .txt, .md, .csv, .json, .pdf, .docx</p>
              </div>
            )}
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Document Title</label>
              <input
                type="text"
                placeholder="e.g. Return & Exchange Policy"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Category</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="general">General</option>
                <option value="policies">Policies</option>
                <option value="faq">FAQ</option>
                <option value="products">Products</option>
                <option value="shipping">Shipping & Orders</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
              Summary / Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Brief summary of document content..."
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
              {uploadTags.map((tag) => (
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
                placeholder={uploadTags.length === 0 ? 'Type tag and press Enter...' : 'Add tag...'}
                value={uploadTagInput}
                onChange={(e) => setUploadTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="bg-transparent text-xs text-slate-800 focus:outline-none flex-1 min-w-[100px]"
              />
            </div>
          </div>

          {/* Active Switch */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Enable for AI Retrieval</span>
              <span className="text-[10px] text-slate-400 block">
                Allow the AI assistant to query this document when answering.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setUploadIsActive(!uploadIsActive)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                uploadIsActive ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  uploadIsActive ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !uploadFile}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
              <span>{isSubmitting ? 'Uploading...' : 'Upload & Index'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
