import { apiRequest } from './apiClient';
import type {
  KnowledgeDocument,
  KnowledgeBaseFilterParams,
  CreateKnowledgeDocumentPayload,
  UpdateKnowledgeDocumentPayload,
} from '../types/knowledgeBase';

export const knowledgeBaseService = {
  getKnowledgeBase: (params?: KnowledgeBaseFilterParams): Promise<KnowledgeDocument[]> => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.source_type && params.source_type !== 'all') query.append('source_type', params.source_type);
    if (params?.is_active !== undefined && params.is_active !== 'all' && params.is_active !== '') {
      query.append('is_active', String(params.is_active));
    }
    if (params?.tag) query.append('tag', params.tag);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString();
    return apiRequest(`/api/v1/ai/knowledge-base/${qs ? `?${qs}` : ''}`);
  },

  getKnowledgeDocument: (id: string): Promise<KnowledgeDocument> => {
    return apiRequest(`/api/v1/ai/knowledge-base/${id}/`);
  },

  uploadKnowledgeDocument: (
    payload: CreateKnowledgeDocumentPayload | FormData
  ): Promise<KnowledgeDocument> => {
    if (payload instanceof FormData) {
      return apiRequest('/api/v1/ai/knowledge-base/upload/', {
        method: 'POST',
        body: payload,
      });
    }

    if (payload.file) {
      const formData = new FormData();
      formData.append('file', payload.file);
      if (payload.title) formData.append('title', payload.title);
      if (payload.description) formData.append('description', payload.description);
      if (payload.raw_content) formData.append('raw_content', payload.raw_content);
      if (payload.source_type) formData.append('source_type', payload.source_type);
      if (payload.tags) {
        formData.append(
          'tags',
          Array.isArray(payload.tags) ? JSON.stringify(payload.tags) : payload.tags
        );
      }
      if (payload.metadata) {
        formData.append(
          'metadata',
          typeof payload.metadata === 'object'
            ? JSON.stringify(payload.metadata)
            : payload.metadata
        );
      }
      if (payload.is_active !== undefined) formData.append('is_active', String(payload.is_active));

      return apiRequest('/api/v1/ai/knowledge-base/upload/', {
        method: 'POST',
        body: formData,
      });
    }

    return apiRequest('/api/v1/ai/knowledge-base/upload/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateKnowledgeDocument: (
    id: string,
    updates: UpdateKnowledgeDocumentPayload
  ): Promise<KnowledgeDocument> => {
    return apiRequest(`/api/v1/ai/knowledge-base/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  deleteKnowledgeDocument: (id: string): Promise<any> => {
    return apiRequest(`/api/v1/ai/knowledge-base/${id}/`, {
      method: 'DELETE',
    });
  },
};
