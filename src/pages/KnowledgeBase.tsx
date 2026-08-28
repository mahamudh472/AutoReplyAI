import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  api,
  type KnowledgeDocument,
  type KnowledgeBaseFilterParams,
  type CreateKnowledgeDocumentPayload,
  type UpdateKnowledgeDocumentPayload
} from '../utils/api';
import {
  FileText,
  Upload,
  Trash2,
  RefreshCw,
  X,
  Search,
  HelpCircle,
  Grid,
  List as ListIcon,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Tag,
  ExternalLink,
  Edit3,
  Eye
} from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const { organizations, activeOrgId } = useApp();
  const currentOrg = organizations.find((o) => o.id === activeOrgId) || organizations[0];

  // Documents state
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Upload modal & forms state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('general');
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [uploadTagInput, setUploadTagInput] = useState('');
  const [uploadIsActive, setUploadIsActive] = useState(true);
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);

  // Text/FAQ modal state
  const [textSourceType, setTextSourceType] = useState<'text' | 'faq'>('text');
  const [textTitle, setTextTitle] = useState('');
  const [textDescription, setTextDescription] = useState('');
  const [textContent, setTextContent] = useState('');
  const [textCategory, setTextCategory] = useState('general');
  const [textTags, setTextTags] = useState<string[]>([]);
  const [textTagInput, setTextTagInput] = useState('');
  const [textIsActive, setTextIsActive] = useState(true);
  const [isSubmittingText, setIsSubmittingText] = useState(false);

  // Detail / Edit drawer state
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);
  const [isEditingDoc, setIsEditingDoc] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete modal state
  const [deleteTargetDoc, setDeleteTargetDoc] = useState<KnowledgeDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification feedback
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // Fetch documents from API
  const fetchDocuments = useCallback(
    async (isBackground = false) => {
      if (!isBackground) {
        setRefreshing(true);
      }
      try {
        const filterParams: KnowledgeBaseFilterParams = {};
        if (statusFilter !== 'all') filterParams.status = statusFilter;
        if (sourceTypeFilter !== 'all') filterParams.source_type = sourceTypeFilter;
        if (activeFilter !== 'all') filterParams.is_active = activeFilter === 'true';
        if (tagFilter.trim()) filterParams.tag = tagFilter.trim();
        if (search.trim()) filterParams.search = search.trim();

        const data = await api.getKnowledgeBase(filterParams);
        setDocuments(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch knowledge base documents:', err);
        const detail = err?.detail || err?.message || 'Failed to load documents';
        setError(detail);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [statusFilter, sourceTypeFilter, activeFilter, tagFilter, search]
  );

  // Debounced search / filter fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocuments();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchDocuments]);

  // Polling for processing/pending documents
  useEffect(() => {
    const hasPendingOrProcessing = documents.some(
      (doc) => doc.status === 'pending' || doc.status === 'processing'
    );

    if (!hasPendingOrProcessing) return;

    const interval = setInterval(() => {
      fetchDocuments(true);
    }, 3500);

    return () => clearInterval(interval);
  }, [documents, fetchDocuments]);

  // Handle File Upload Submit
  const handleFileUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile && !uploadTitle.trim()) {
      setError('Please select a file to upload');
      return;
    }

    setIsSubmittingUpload(true);
    setError(null);

    try {
      const payload: CreateKnowledgeDocumentPayload = {
        file: uploadFile,
        title: uploadTitle.trim() || (uploadFile ? uploadFile.name : 'Untitled Document'),
        description: uploadDescription.trim() || undefined,
        source_type: 'file',
        tags: uploadTags,
        metadata: {
          category: uploadCategory,
          uploaded_from: 'web_dashboard'
        },
        is_active: uploadIsActive
      };

      const newDoc = await api.uploadKnowledgeDocument(payload);
      setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadTitle('');
      setUploadDescription('');
      setUploadTags([]);
      setUploadTagInput('');
      setUploadIsActive(true);
      showToast('Document uploaded successfully and queued for indexing!');
      // Re-fetch to synchronize
      fetchDocuments(true);
    } catch (err: any) {
      console.error('Failed to upload document:', err);
      const detail =
        err?.detail ||
        (typeof err === 'object' ? JSON.stringify(err) : 'Failed to upload document');
      setError(detail);
    } finally {
      setIsSubmittingUpload(false);
    }
  };

  // Handle Text/FAQ Submit
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textTitle.trim() || !textContent.trim()) {
      setError('Please provide both title and content');
      return;
    }

    setIsSubmittingText(true);
    setError(null);

    try {
      const payload: CreateKnowledgeDocumentPayload = {
        title: textTitle.trim(),
        description: textDescription.trim() || undefined,
        raw_content: textContent.trim(),
        source_type: textSourceType,
        tags: textTags,
        metadata: {
          category: textCategory,
          type: textSourceType
        },
        is_active: textIsActive
      };

      const newDoc = await api.uploadKnowledgeDocument(payload);
      setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
      setShowTextModal(false);
      setTextTitle('');
      setTextDescription('');
      setTextContent('');
      setTextTags([]);
      setTextTagInput('');
      setTextIsActive(true);
      showToast('Content added to Knowledge Base and scheduled for indexing!');
      fetchDocuments(true);
    } catch (err: any) {
      console.error('Failed to create text document:', err);
      const detail =
        err?.detail ||
        (typeof err === 'object' ? JSON.stringify(err) : 'Failed to add content');
      setError(detail);
    } finally {
      setIsSubmittingText(false);
    }
  };

  // Open Edit/Detail Drawer
  const handleOpenDocDetails = async (doc: KnowledgeDocument) => {
    setSelectedDoc(doc);
    setEditTitle(doc.title);
    setEditDescription(doc.description || '');
    setEditTags(Array.isArray(doc.tags) ? [...doc.tags] : []);
    setEditCategory(doc.metadata?.category || 'general');
    setEditIsActive(doc.is_active);
    setIsEditingDoc(false);

    // Fetch freshest version
    try {
      const fresh = await api.getKnowledgeDocument(doc.id);
      setSelectedDoc(fresh);
      setEditTitle(fresh.title);
      setEditDescription(fresh.description || '');
      setEditTags(Array.isArray(fresh.tags) ? [...fresh.tags] : []);
      setEditCategory(fresh.metadata?.category || 'general');
      setEditIsActive(fresh.is_active);
    } catch (err) {
      console.error('Failed to fetch document detail:', err);
    }
  };

  // Handle Save Edit
  const handleSaveEdit = async () => {
    if (!selectedDoc) return;
    setIsSavingEdit(true);

    try {
      const updates: UpdateKnowledgeDocumentPayload = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        tags: editTags,
        metadata: {
          ...(selectedDoc.metadata || {}),
          category: editCategory
        },
        is_active: editIsActive
      };

      const updated = await api.updateKnowledgeDocument(selectedDoc.id, updates);
      setSelectedDoc(updated);
      setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setIsEditingDoc(false);
      showToast('Document updated successfully');
    } catch (err: any) {
      console.error('Failed to update document:', err);
      const detail = err?.detail || 'Failed to update document';
      setError(detail);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle Quick Toggle Active
  const handleToggleActive = async (doc: KnowledgeDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = !doc.is_active;

    // Optimistic update
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, is_active: newStatus } : d))
    );
    if (selectedDoc && selectedDoc.id === doc.id) {
      setSelectedDoc({ ...selectedDoc, is_active: newStatus });
    }

    try {
      const updated = await api.updateKnowledgeDocument(doc.id, { is_active: newStatus });
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
    } catch (err: any) {
      console.error('Failed to toggle status:', err);
      // Revert
      setDocuments((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, is_active: doc.is_active } : d))
      );
      setError('Failed to update document status');
    }
  };

  // Handle Delete
  const handleDeleteDoc = async () => {
    if (!deleteTargetDoc) return;
    setIsDeleting(true);

    try {
      await api.deleteKnowledgeDocument(deleteTargetDoc.id);
      setDocuments((prev) => prev.filter((d) => d.id !== deleteTargetDoc.id));
      if (selectedDoc && selectedDoc.id === deleteTargetDoc.id) {
        setSelectedDoc(null);
      }
      setDeleteTargetDoc(null);
      showToast('Document deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete document:', err);
      const detail = err?.detail || 'Failed to delete document';
      setError(detail);
    } finally {
      setIsDeleting(false);
    }
  };

  // Tag helper
  const addTag = (
    tagInput: string,
    setTagInput: (val: string) => void,
    tagsList: string[],
    setTagsList: (val: string[]) => void
  ) => {
    const trimmed = tagInput.trim().replace(/^#/, '').toLowerCase();
    if (trimmed && !tagsList.includes(trimmed)) {
      setTagsList([...tagsList, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (
    tagToRemove: string,
    tagsList: string[],
    setTagsList: (val: string[]) => void
  ) => {
    setTagsList(tagsList.filter((t) => t !== tagToRemove));
  };

  // Formatting helpers
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getFileIcon = (fileType: string | null, sourceType: string) => {
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

  const renderStatusBadge = (status: string, errorMessage?: string | null) => {
    switch (status) {
      case 'indexed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            Indexed
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold">
            <RefreshCw className="h-3 w-3 text-blue-500 animate-spin" />
            Processing
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold">
            <Clock className="h-3 w-3 text-amber-500" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold cursor-pointer"
            title={errorMessage || 'Indexing failed'}
          >
            <AlertTriangle className="h-3 w-3 text-rose-500" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
            {status}
          </span>
        );
    }
  };

  // Stats computed from document list
  const totalDocs = documents.length;
  const activeDocs = documents.filter((d) => d.is_active).length;
  const indexedDocs = documents.filter((d) => d.status === 'indexed').length;
  const totalChunks = documents.reduce((acc, d) => acc + (d.chunk_count || 0), 0);
  const totalWords = documents.reduce((acc, d) => acc + (d.word_count || 0), 0);
  const totalBytes = documents.reduce((acc, d) => acc + (d.file_size || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in text-slate-700">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{successToast}</span>
          <button
            onClick={() => setSuccessToast(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-850 font-outfit">
              Knowledge Base
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold">
              {indexedDocs} / {totalDocs} Indexed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Store documents, policies, and FAQs to power accurate context retrieval for your AI auto-replies.
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => fetchDocuments()}
            disabled={refreshing}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Refresh Knowledge Base"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
            <span className="h-4 w-4 bg-blue-600 rounded text-white flex items-center justify-center text-[9px] font-bold">
              {currentOrg?.name?.charAt(0) || 'A'}
            </span>
            <span className="max-w-[120px] truncate">{currentOrg?.name || 'Organization'}</span>
          </div>

          <button
            onClick={() => setShowTextModal(true)}
            className="px-3.5 py-2 bg-white border border-blue-200 hover:border-blue-400 text-blue-600 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileText className="h-4 w-4" />
            <span>Add Text</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start justify-between gap-3 text-xs text-rose-700">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error:</span> {error}
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-rose-500 hover:text-rose-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Filters, Tabs, Table/Grid (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Card Container */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden p-6 space-y-5">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-semibold overflow-x-auto">
              {[
                { id: 'all', label: 'All Documents', count: totalDocs },
                { id: 'indexed', label: 'Indexed', count: documents.filter((d) => d.status === 'indexed').length },
                { id: 'processing', label: 'Processing', count: documents.filter((d) => d.status === 'processing').length },
                { id: 'pending', label: 'Pending', count: documents.filter((d) => d.status === 'pending').length },
                { id: 'failed', label: 'Failed', count: documents.filter((d) => d.status === 'failed').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`pb-2 px-2.5 font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 border-b-2 -mb-[13px] ${
                    statusFilter === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-slate-400 border-transparent hover:text-slate-600'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      statusFilter === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-500'
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
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'table'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Table View"
                  >
                    <ListIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Document List: Table or Grid */}
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
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Document</span>
                  </button>
                  <button
                    onClick={() => setShowTextModal(true)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Add Text Snippet</span>
                  </button>
                </div>
              </div>
            ) : viewMode === 'table' ? (
              /* Table Layout */
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
                          onClick={() => handleOpenDocDetails(doc)}
                          className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                        >
                          {/* Name & Source */}
                          <td className="p-4">
                            <div className="flex items-start gap-3">
                              {getFileIcon(doc.file_type, doc.source_type)}
                              <div className="truncate max-w-[220px]">
                                <span className="font-bold text-slate-800 truncate block leading-snug group-hover:text-blue-600 transition-colors">
                                  {doc.title}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                                  {doc.file_name && <span>{doc.file_name}</span>}
                                  {doc.file_size ? (
                                    <span>• {formatFileSize(doc.file_size)}</span>
                                  ) : null}
                                  <span>• {formatDate(doc.created_at)}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            {renderStatusBadge(doc.status, doc.error_message)}
                          </td>

                          {/* Stats */}
                          <td className="p-4">
                            <div className="text-[11px] space-y-0.5">
                              <span className="text-slate-700 font-semibold block">
                                {doc.chunk_count || 0} chunks
                              </span>
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
                                <span className="text-[9px] text-slate-400 font-bold">
                                  +{doc.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Active Toggle */}
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(e) => handleToggleActive(doc, e)}
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
                                onClick={() => handleOpenDocDetails(doc)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                                title="View / Edit Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTargetDoc(doc)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
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
            ) : (
              /* Grid Layout */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleOpenDocDetails(doc)}
                    className="p-5 border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-white space-y-3 group flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          {getFileIcon(doc.file_type, doc.source_type)}
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {doc.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 block">
                              {formatDate(doc.created_at)}
                            </span>
                          </div>
                        </div>
                        {renderStatusBadge(doc.status, doc.error_message)}
                      </div>

                      {doc.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {doc.description}
                        </p>
                      )}

                      {Array.isArray(doc.tags) && doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {doc.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-semibold"
                            >
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
                          onClick={(e) => handleToggleActive(doc, e)}
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
                          onClick={() => setDeleteTargetDoc(doc)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Add, Stats, Guidelines (1/3 width) */}
        <div className="space-y-6">
          {/* Quick Add Cards */}
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
                onClick={() => setShowUploadModal(true)}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/10 text-left flex items-center gap-3.5 transition-all group"
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
                onClick={() => {
                  setTextSourceType('text');
                  setShowTextModal(true);
                }}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/10 text-left flex items-center gap-3.5 transition-all group"
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
                onClick={() => {
                  setTextSourceType('faq');
                  setShowTextModal(true);
                }}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/10 text-left flex items-center gap-3.5 transition-all group"
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

          {/* Knowledge Base Overview Stats */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 font-outfit">Knowledge Base Overview</h3>

            <div className="space-y-3 text-xs leading-normal">
              <div className="flex justify-between py-1 items-center border-b border-slate-100 pb-2">
                <span className="text-slate-400">Total Documents</span>
                <span className="text-slate-800 font-bold">{totalDocs}</span>
              </div>
              <div className="flex justify-between py-1 items-center border-b border-slate-100 pb-2">
                <span className="text-slate-400">Active in AI Context</span>
                <span className="text-emerald-600 font-bold">{activeDocs}</span>
              </div>
              <div className="flex justify-between py-1 items-center border-b border-slate-100 pb-2">
                <span className="text-slate-400">Indexed Vectors / Chunks</span>
                <span className="text-slate-800 font-bold">{totalChunks.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 items-center border-b border-slate-100 pb-2">
                <span className="text-slate-400">Total Indexed Words</span>
                <span className="text-slate-800 font-bold">{totalWords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 items-center">
                <span className="text-slate-400">Total File Size</span>
                <span className="text-slate-800 font-bold">{formatFileSize(totalBytes) || '0 B'}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
              Documents are converted to semantic embeddings and searched dynamically when customers send messages.
            </p>
          </div>

          {/* Indexing Tips */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-outfit">
              <Lightbulb className="h-4.5 w-4.5 text-amber-500" />
              Optimization Tips
            </h3>

            <ul className="space-y-3 text-xs text-slate-500">
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[9px] font-bold">
                  ✓
                </span>
                <span>Break down large documents into coherent sections or FAQs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[9px] font-bold">
                  ✓
                </span>
                <span>Tag documents with relevant keywords (e.g. #shipping, #refunds, #pricing).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[9px] font-bold">
                  ✓
                </span>
                <span>Toggle inactive older documents to prevent outdated answers.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-850 font-outfit">Upload Document</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload a file to be parsed, chunked, and indexed in the knowledge base.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFileUploadSubmit} className="p-6 space-y-4">
              {/* File Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                  uploadFile
                    ? 'border-blue-500 bg-blue-50/20'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
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
                      <p className="text-xs font-bold text-slate-800 truncate max-w-xs">
                        {uploadFile.name}
                      </p>
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
                    <p className="text-xs font-bold text-slate-700">
                      Click to choose file or drag & drop here
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Supports .txt, .md, .csv, .json, .pdf, .docx
                    </p>
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                    Document Title
                  </label>
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
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                    Category
                  </label>
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
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {uploadTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag, uploadTags, setUploadTags)}
                        className="text-blue-500 hover:text-blue-800"
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
                        addTag(uploadTagInput, setUploadTagInput, uploadTags, setUploadTags);
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
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUpload || !uploadFile}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmittingUpload && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isSubmittingUpload ? 'Uploading...' : 'Upload & Index'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Text / FAQ Modal */}
      {showTextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-850 font-outfit">
                  {textSourceType === 'faq' ? 'Add FAQ Pair' : 'Add Text Snippet'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paste raw text or Q&A content directly without needing a file.
                </p>
              </div>
              <button
                onClick={() => setShowTextModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleTextSubmit} className="p-6 space-y-4">
              {/* Type Switcher */}
              <div className="flex border border-slate-200 rounded-xl p-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setTextSourceType('text')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    textSourceType === 'text'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Text / Policy Snippet
                </button>
                <button
                  type="button"
                  onClick={() => setTextSourceType('faq')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    textSourceType === 'faq'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  FAQ / Question & Answer
                </button>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                    {textSourceType === 'faq' ? 'Question / Topic' : 'Document Title'}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      textSourceType === 'faq'
                        ? 'e.g. Do you ship internationally?'
                        : 'e.g. Store Operating Hours'
                    }
                    value={textTitle}
                    onChange={(e) => setTextTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                    Category
                  </label>
                  <select
                    value={textCategory}
                    onChange={(e) => setTextCategory(e.target.value)}
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
                  value={textDescription}
                  onChange={(e) => setTextDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Content textarea */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">
                    {textSourceType === 'faq' ? 'Answer / Detailed Response' : 'Full Content'}
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {textContent.trim().split(/\s+/).filter(Boolean).length} words •{' '}
                    {textContent.length} chars
                  </span>
                </div>
                <textarea
                  rows={5}
                  placeholder={
                    textSourceType === 'faq'
                      ? 'Yes, we ship to over 50 countries worldwide. International shipping typically takes 7-14 business days...'
                      : 'Type or paste knowledge base content here...'
                  }
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 resize-none leading-relaxed font-sans"
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {textTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag, textTags, setTextTags)}
                        className="text-blue-500 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={textTags.length === 0 ? 'Type tag and press Enter...' : 'Add tag...'}
                    value={textTagInput}
                    onChange={(e) => setTextTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addTag(textTagInput, setTextTagInput, textTags, setTextTags);
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
                  onClick={() => setTextIsActive(!textIsActive)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    textIsActive ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      textIsActive ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTextModal(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingText || !textTitle.trim() || !textContent.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmittingText && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isSubmittingText ? 'Saving...' : 'Save & Index'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Document Details / Edit Drawer */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                {getFileIcon(selectedDoc.file_type, selectedDoc.source_type)}
                <div>
                  <h3 className="text-base font-bold text-slate-850 font-outfit line-clamp-1">
                    {selectedDoc.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {renderStatusBadge(selectedDoc.status, selectedDoc.error_message)}
                    <span className="text-[10px] text-slate-400">
                      ID: {selectedDoc.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Document Overview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Chunks</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                    {selectedDoc.chunk_count || 0}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Words</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                    {selectedDoc.word_count || 0}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Source</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block uppercase">
                    {selectedDoc.source_type}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Size</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                    {formatFileSize(selectedDoc.file_size) || 'Text'}
                  </span>
                </div>
              </div>

              {/* Error Alert if failed */}
              {selectedDoc.status === 'failed' && selectedDoc.error_message && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    Indexing Error
                  </span>
                  <p>{selectedDoc.error_message}</p>
                </div>
              )}

              {/* Editable Fields / Metadata */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Document Metadata
                  </h4>
                  {!isEditingDoc ? (
                    <button
                      onClick={() => setIsEditingDoc(true)}
                      className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:text-blue-700"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit Info
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditingDoc(false)}
                      className="text-slate-400 text-xs font-semibold hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {isEditingDoc ? (
                  <div className="space-y-3.5 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-1.5 p-2 bg-white border border-slate-200 rounded-xl">
                        {editTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag, editTags, setEditTags)}
                              className="text-blue-500 hover:text-blue-800"
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
                              addTag(editTagInput, setEditTagInput, editTags, setEditTags);
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
                        onClick={handleSaveEdit}
                        disabled={isSavingEdit || !editTitle.trim()}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        {isSavingEdit && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    {selectedDoc.description && (
                      <div className="p-3 bg-slate-50 rounded-xl text-slate-600 leading-relaxed">
                        {selectedDoc.description}
                      </div>
                    )}

                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                      <div className="p-3 flex justify-between items-center bg-slate-50/50">
                        <span className="text-slate-400 text-[11px]">Active</span>
                        <span
                          className={`font-bold text-[11px] ${
                            selectedDoc.is_active ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          {selectedDoc.is_active ? 'Yes (Enabled in AI)' : 'No (Disabled)'}
                        </span>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <span className="text-slate-400 text-[11px]">File Attached</span>
                        {selectedDoc.file_url ? (
                          <a
                            href={selectedDoc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                          >
                            <span>{selectedDoc.file_name || 'Download File'}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px]">None (Raw text)</span>
                        )}
                      </div>
                      <div className="p-3 flex justify-between items-center bg-slate-50/50">
                        <span className="text-slate-400 text-[11px]">Created By</span>
                        <span className="text-slate-700 font-semibold text-[11px]">
                          {selectedDoc.created_by_email || '—'}
                        </span>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <span className="text-slate-400 text-[11px]">Created At</span>
                        <span className="text-slate-700 font-semibold text-[11px]">
                          {formatDateTime(selectedDoc.created_at)}
                        </span>
                      </div>
                      <div className="p-3 flex justify-between items-center bg-slate-50/50">
                        <span className="text-slate-400 text-[11px]">Last Indexed</span>
                        <span className="text-slate-700 font-semibold text-[11px]">
                          {formatDateTime(selectedDoc.indexed_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Raw Content Preview */}
              {selectedDoc.raw_content && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Content Preview
                  </h4>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                    {selectedDoc.raw_content}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between sticky bottom-0">
              <button
                onClick={() => setDeleteTargetDoc(selectedDoc)}
                className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Document</span>
              </button>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Modal */}
      {deleteTargetDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-850 font-outfit">Delete Document</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete{' '}
                <strong className="text-slate-800">{deleteTargetDoc.title}</strong>? This will permanently
                remove its vector embeddings and associated files.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTargetDoc(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteDoc}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
