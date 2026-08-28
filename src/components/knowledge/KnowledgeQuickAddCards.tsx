import React from 'react';
import { Upload, FileText, HelpCircle } from 'lucide-react';

interface KnowledgeQuickAddCardsProps {
  onOpenUpload: () => void;
  onOpenText: () => void;
  onOpenFAQ: () => void;
}

export const KnowledgeQuickAddCards: React.FC<KnowledgeQuickAddCardsProps> = ({
  onOpenUpload,
  onOpenText,
  onOpenFAQ,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800 font-outfit">Add Knowledge</h3>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Keep your AI updated with fresh store policies, FAQs, and product catalogs.
        </p>
      </div>

      <div className="space-y-2.5">
        {/* Option 1: Upload Documents */}
        <button
          onClick={onOpenUpload}
          className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/10 text-left flex items-center gap-3.5 transition-all group cursor-pointer"
        >
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Upload className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 leading-none group-hover:text-blue-600 transition-colors">
              Upload Documents
            </h4>
            <p className="text-[10px] text-slate-400 mt-1.5 leading-none">
              .txt, .md, .csv, .json, .pdf, .docx
            </p>
          </div>
        </button>

        {/* Option 2: Add Text Manually */}
        <button
          onClick={onOpenText}
          className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/10 text-left flex items-center gap-3.5 transition-all group cursor-pointer"
        >
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <FileText className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">
              Add Text Snippet
            </h4>
            <p className="text-[10px] text-slate-400 mt-1.5 leading-none">
              Paste policies or shipping guidelines
            </p>
          </div>
        </button>

        {/* Option 3: FAQ Entry */}
        <button
          onClick={onOpenFAQ}
          className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/10 text-left flex items-center gap-3.5 transition-all group cursor-pointer"
        >
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl flex-shrink-0 border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <HelpCircle className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 leading-none group-hover:text-purple-600 transition-colors">
              Add FAQ Q&A Pair
            </h4>
            <p className="text-[10px] text-slate-400 mt-1.5 leading-none">
              Common questions with standard answers
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
