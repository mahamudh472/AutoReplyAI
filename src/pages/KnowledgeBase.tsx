import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import type { KnowledgeDocument, DocumentSourceType } from '../types/knowledgeBase';
import {
  KnowledgeHeader,
  KnowledgeStatsOverview,
  KnowledgeQuickAddCards,
  KnowledgeTips,
  KnowledgeFilterBar,
  KnowledgeTable,
  KnowledgeGrid,
  KnowledgeUploadModal,
  KnowledgeTextModal,
  KnowledgeDetailDrawer,
  KnowledgeDeleteModal,
} from '../components/knowledge';
import { CheckCircle2, X, AlertCircle, RefreshCw, FileText, Upload } from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const { organizations, activeOrgId } = useApp();
  const currentOrg = organizations.find((o) => o.id === activeOrgId) || organizations[0];

  const {
    documents,
    loading,
    refreshing,
    error,
    setError,
    successToast,
    setSuccessToast,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sourceTypeFilter,
    setSourceTypeFilter,
    activeFilter,
    setActiveFilter,
    tagFilter,
    setTagFilter,
    viewMode,
    setViewMode,
    totalDocs,
    activeDocs,
    indexedDocs,
    totalChunks,
    totalWords,
    totalBytes,
    fetchDocuments,
    uploadDocument,
    updateDocument,
    toggleActive,
    deleteDocument,
  } = useKnowledgeBase();

  // Modals & Drawer State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [textModalType, setTextModalType] = useState<'text' | 'faq'>('text');
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);
  const [deleteTargetDoc, setDeleteTargetDoc] = useState<KnowledgeDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenTextModal = (type: 'text' | 'faq' = 'text') => {
    setTextModalType(type);
    setShowTextModal(true);
  };

  const handleUploadSubmit = async (data: {
    file: File;
    title: string;
    description: string;
    category: string;
    tags: string[];
    isActive: boolean;
  }) => {
    await uploadDocument({
      file: data.file,
      title: data.title,
      description: data.description || undefined,
      source_type: 'file',
      tags: data.tags,
      metadata: {
        category: data.category,
        uploaded_from: 'web_dashboard',
      },
      is_active: data.isActive,
    });
  };

  const handleTextSubmit = async (data: {
    sourceType: DocumentSourceType;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    isActive: boolean;
  }) => {
    await uploadDocument({
      title: data.title,
      description: data.description || undefined,
      raw_content: data.content,
      source_type: data.sourceType,
      tags: data.tags,
      metadata: {
        category: data.category,
        type: data.sourceType,
      },
      is_active: data.isActive,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetDoc) return;
    setIsDeleting(true);
    try {
      await deleteDocument(deleteTargetDoc.id);
      if (selectedDoc && selectedDoc.id === deleteTargetDoc.id) {
        setSelectedDoc(null);
      }
      setDeleteTargetDoc(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-700">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast(null)} className="ml-2 text-slate-400 hover:text-white cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header */}
      <KnowledgeHeader
        currentOrg={currentOrg}
        indexedDocs={indexedDocs}
        totalDocs={totalDocs}
        refreshing={refreshing}
        onRefresh={() => fetchDocuments()}
        onOpenTextModal={() => handleOpenTextModal('text')}
        onOpenUploadModal={() => setShowUploadModal(true)}
      />

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start justify-between gap-3 text-xs text-rose-700">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error:</span> {error}
            </div>
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-800 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Filters & Table/Grid (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden p-6 space-y-5">
            <KnowledgeFilterBar
              documents={documents}
              totalDocs={totalDocs}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              search={search}
              setSearch={setSearch}
              sourceTypeFilter={sourceTypeFilter}
              setSourceTypeFilter={setSourceTypeFilter}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              tagFilter={tagFilter}
              setTagFilter={setTagFilter}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {/* Document Content State */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-xs font-semibold">Loading knowledge base documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">No documents found</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {search || statusFilter !== 'all' || sourceTypeFilter !== 'all' || tagFilter
                      ? 'No documents match your current filter criteria. Try clearing the filters.'
                      : 'Add policies, product info, or FAQs to allow AI to craft informed replies.'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Document</span>
                  </button>
                  <button
                    onClick={() => handleOpenTextModal('text')}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Add Text Snippet</span>
                  </button>
                </div>
              </div>
            ) : viewMode === 'table' ? (
              <KnowledgeTable
                documents={documents}
                activeDocs={activeDocs}
                indexedDocs={indexedDocs}
                onOpenDetails={(doc) => setSelectedDoc(doc)}
                onToggleActive={toggleActive}
                onDeleteRequest={(doc) => setDeleteTargetDoc(doc)}
              />
            ) : (
              <KnowledgeGrid
                documents={documents}
                onOpenDetails={(doc) => setSelectedDoc(doc)}
                onToggleActive={toggleActive}
                onDeleteRequest={(doc) => setDeleteTargetDoc(doc)}
              />
            )}
          </div>
        </div>

        {/* Right Column: Quick Add, Stats, Guidelines (1/3 width) */}
        <div className="space-y-6">
          <KnowledgeQuickAddCards
            onOpenUpload={() => setShowUploadModal(true)}
            onOpenText={() => handleOpenTextModal('text')}
            onOpenFAQ={() => handleOpenTextModal('faq')}
          />
          <KnowledgeStatsOverview
            totalDocs={totalDocs}
            activeDocs={activeDocs}
            totalChunks={totalChunks}
            totalWords={totalWords}
            totalBytes={totalBytes}
          />
          <KnowledgeTips />
        </div>
      </div>

      {/* Modals & Drawers */}
      <KnowledgeUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleUploadSubmit}
      />

      <KnowledgeTextModal
        isOpen={showTextModal}
        initialType={textModalType}
        onClose={() => setShowTextModal(false)}
        onSubmit={handleTextSubmit}
      />

      <KnowledgeDetailDrawer
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onSaveEdit={updateDocument}
        onDeleteRequest={(doc) => setDeleteTargetDoc(doc)}
      />

      <KnowledgeDeleteModal
        document={deleteTargetDoc}
        isDeleting={isDeleting}
        onCancel={() => setDeleteTargetDoc(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
