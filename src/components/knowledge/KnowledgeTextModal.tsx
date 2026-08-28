import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import type { DocumentSourceType } from '../../types/knowledgeBase';

interface KnowledgeTextModalProps {
  isOpen: boolean;
  initialType?: 'text' | 'faq';
  onClose: () => void;
  onSubmit: (data: {
    sourceType: DocumentSourceType;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    isActive: boolean;
  }) => Promise<void>;
}

export const KnowledgeTextModal: React.FC<KnowledgeTextModalProps> = ({
  isOpen,
  initialType = 'text',
  onClose,
  onSubmit,
}) => {
  const [sourceType, setSourceType] = useState<'text' | 'faq'>(initialType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const addTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '').toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        sourceType,
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        category,
        tags,
        isActive,
      });
      onClose();
      setTitle('');
      setDescription('');
      setContent('');
      setTags([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-scale-up">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-850 font-outfit">
              {sourceType === 'faq' ? 'Add FAQ Pair' : 'Add Text Snippet'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste raw text or Q&A content directly without needing a file.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Switcher */}
          <div className="flex border border-slate-200 rounded-xl p-1 bg-slate-50">
            <button
              type="button"
              onClick={() => setSourceType('text')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sourceType === 'text' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Text / Policy Snippet
            </button>
            <button
              type="button"
              onClick={() => setSourceType('faq')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                sourceType === 'faq' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              FAQ / Question & Answer
            </button>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                {sourceType === 'faq' ? 'Question / Topic' : 'Document Title'}
              </label>
              <input
                type="text"
                placeholder={
                  sourceType === 'faq' ? 'e.g. Do you ship internationally?' : 'e.g. Store Operating Hours'
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              Summary (Optional)
            </label>
            <input
              type="text"
              placeholder="Short summary for indexing..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Content textarea */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400">
                {sourceType === 'faq' ? 'Answer / Detailed Response' : 'Full Content'}
              </label>
              <span className="text-[10px] text-slate-400">
                {content.trim().split(/\s+/).filter(Boolean).length} words • {content.length} chars
              </span>
            </div>
            <textarea
              rows={5}
              placeholder={
                sourceType === 'faq'
                  ? 'Yes, we ship to over 50 countries worldwide. International shipping typically takes 7-14 business days...'
                  : 'Type or paste knowledge base content here...'
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 resize-none leading-relaxed font-sans"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
              {tags.map((tag) => (
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
                placeholder={tags.length === 0 ? 'Type tag and press Enter...' : 'Add tag...'}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
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

          {/* Active Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Enable for AI Retrieval</span>
              <span className="text-[10px] text-slate-400 block">
                Allow the AI assistant to use this text snippet.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isActive ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isActive ? 'translate-x-4' : 'translate-x-0'
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
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
              <span>{isSubmitting ? 'Saving...' : 'Save & Index'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
