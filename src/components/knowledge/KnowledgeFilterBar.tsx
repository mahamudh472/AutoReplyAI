import React from 'react';
import { Search, Tag, X, List as ListIcon, Grid } from 'lucide-react';
import type { KnowledgeDocument } from '../../types/knowledgeBase';

interface KnowledgeFilterBarProps {
  documents: KnowledgeDocument[];
  totalDocs: number;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  search: string;
  setSearch: (val: string) => void;
  sourceTypeFilter: string;
  setSourceTypeFilter: (val: string) => void;
  activeFilter: string;
  setActiveFilter: (val: string) => void;
  tagFilter: string;
  setTagFilter: (val: string) => void;
  viewMode: 'table' | 'grid';
  setViewMode: (val: 'table' | 'grid') => void;
}

export const KnowledgeFilterBar: React.FC<KnowledgeFilterBarProps> = ({
  documents,
  totalDocs,
  statusFilter,
  setStatusFilter,
  search,
  setSearch,
  sourceTypeFilter,
  setSourceTypeFilter,
  activeFilter,
  setActiveFilter,
  tagFilter,
  setTagFilter,
  viewMode,
  setViewMode,
}) => {
  const tabs = [
    { id: 'all', label: 'All Documents', count: totalDocs },
    { id: 'indexed', label: 'Indexed', count: documents.filter((d) => d.status === 'indexed').length },
    { id: 'processing', label: 'Processing', count: documents.filter((d) => d.status === 'processing').length },
    { id: 'pending', label: 'Pending', count: documents.filter((d) => d.status === 'pending').length },
    { id: 'failed', label: 'Failed', count: documents.filter((d) => d.status === 'failed').length },
  ];

  return (
    <div className="space-y-5">
      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-semibold overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`pb-2 px-2.5 font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 border-b-2 -mb-[13px] cursor-pointer ${
              statusFilter === tab.id
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusFilter === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search titles, filenames, content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Source Type Filter */}
          <select
            value={sourceTypeFilter}
            onChange={(e) => setSourceTypeFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
          >
            <option value="all">All Sources</option>
            <option value="file">Files (.txt, .md, .pdf, .docx)</option>
            <option value="text">Text Snippets</option>
            <option value="faq">FAQ Pairs</option>
            <option value="url">URLs</option>
          </select>

          {/* Active Filter */}
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
          >
            <option value="all">Active & Inactive</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>

          {/* Tag Filter Input */}
          <div className="relative min-w-[120px]">
            <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter tag..."
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
            />
            {tagFilter && (
              <button
                onClick={() => setTagFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex border border-slate-200 rounded-xl overflow-hidden p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <ListIcon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <Grid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
