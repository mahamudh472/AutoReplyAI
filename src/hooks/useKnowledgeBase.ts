import { useState, useEffect, useCallback } from 'react';
import type {
  KnowledgeDocument,
  KnowledgeBaseFilterParams,
  CreateKnowledgeDocumentPayload,
  UpdateKnowledgeDocumentPayload,
} from '../types/knowledgeBase';
import { api } from '../services';

export const useKnowledgeBase = () => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

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

  // Debounced search
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

  const uploadDocument = async (payload: CreateKnowledgeDocumentPayload) => {
    try {
      const newDoc = await api.uploadKnowledgeDocument(payload);
      setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
      showToast('Document uploaded successfully and queued for indexing!');
      fetchDocuments(true);
      return newDoc;
    } catch (err: any) {
      console.error('Failed to upload document:', err);
      const detail = err?.detail || (typeof err === 'object' ? JSON.stringify(err) : 'Failed to upload document');
      setError(detail);
      throw err;
    }
  };

  const updateDocument = async (id: string, updates: UpdateKnowledgeDocumentPayload) => {
    try {
      const updated = await api.updateKnowledgeDocument(id, updates);
      setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      showToast('Document updated successfully');
      return updated;
    } catch (err: any) {
      console.error('Failed to update document:', err);
      const detail = err?.detail || 'Failed to update document';
      setError(detail);
      throw err;
    }
  };

  const toggleActive = async (doc: KnowledgeDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = !doc.is_active;

    // Optimistic update
    setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, is_active: newStatus } : d)));

    try {
      const updated = await api.updateKnowledgeDocument(doc.id, { is_active: newStatus });
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
    } catch (err: any) {
      console.error('Failed to toggle status:', err);
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, is_active: doc.is_active } : d)));
      setError('Failed to update document status');
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await api.deleteKnowledgeDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      showToast('Document deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete document:', err);
      const detail = err?.detail || 'Failed to delete document';
      setError(detail);
      throw err;
    }
  };

  // Stats computed from documents
  const totalDocs = documents.length;
  const activeDocs = documents.filter((d) => d.is_active).length;
  const indexedDocs = documents.filter((d) => d.status === 'indexed').length;
  const totalChunks = documents.reduce((acc, d) => acc + (d.chunk_count || 0), 0);
  const totalWords = documents.reduce((acc, d) => acc + (d.word_count || 0), 0);
  const totalBytes = documents.reduce((acc, d) => acc + (d.file_size || 0), 0);

  return {
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
  };
};
