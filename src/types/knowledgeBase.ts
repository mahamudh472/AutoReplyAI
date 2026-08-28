export type DocumentSourceType = 'file' | 'text' | 'faq' | 'url' | string;
export type DocumentStatus = 'pending' | 'processing' | 'indexed' | 'failed' | string;

export interface KnowledgeDocument {
  id: string;
  organization_id: string;
  organization_name: string;
  title: string;
  description: string | null;
  file: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  source_type: DocumentSourceType;
  raw_content: string | null;
  status: DocumentStatus;
  error_message: string | null;
  character_count: number;
  word_count: number;
  chunk_count: number;
  tags: string[];
  metadata: Record<string, any>;
  is_active: boolean;
  created_by_email: string | null;
  created_at: string;
  updated_at: string;
  indexed_at: string | null;
}

export interface KnowledgeBaseFilterParams {
  status?: DocumentStatus;
  source_type?: DocumentSourceType;
  is_active?: boolean | string;
  tag?: string;
  search?: string;
}

export interface CreateKnowledgeDocumentPayload {
  file?: File | null;
  title?: string;
  description?: string;
  raw_content?: string;
  source_type?: DocumentSourceType;
  tags?: string[] | string;
  metadata?: Record<string, any> | string;
  is_active?: boolean;
}

export interface UpdateKnowledgeDocumentPayload {
  title?: string;
  description?: string;
  raw_content?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  is_active?: boolean;
}

// Local / Mock KB Document for backward compatibility with AppContext
export interface KBDocument {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'text';
  content: string;
  uploadDate: string;
  status: 'indexing' | 'ready';
}
