import React from 'react';

interface KnowledgeFileIconProps {
  fileType: string | null;
  sourceType: string;
}

export const KnowledgeFileIcon: React.FC<KnowledgeFileIconProps> = ({ fileType, sourceType }) => {
  const ft = (fileType || sourceType || '').toLowerCase();

  if (ft.includes('pdf')) {
    return (
      <div className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-100 flex-shrink-0 font-bold uppercase text-[9px]">
        PDF
      </div>
    );
  }
  if (ft.includes('csv') || ft.includes('xls')) {
    return (
      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex-shrink-0 font-bold uppercase text-[9px]">
        CSV
      </div>
    );
  }
  if (ft.includes('json') || ft.includes('md') || ft.includes('code')) {
    return (
      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex-shrink-0 font-bold uppercase text-[9px]">
        {ft.toUpperCase()}
      </div>
    );
  }
  if (sourceType === 'faq') {
    return (
      <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex-shrink-0 font-bold uppercase text-[9px]">
        FAQ
      </div>
    );
  }
  if (sourceType === 'url') {
    return (
      <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100 flex-shrink-0 font-bold uppercase text-[9px]">
        URL
      </div>
    );
  }
  return (
    <div className="p-2 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex-shrink-0 font-bold uppercase text-[9px]">
      {ft.slice(0, 4) || 'TXT'}
    </div>
  );
};
