export type AIProvider = 'openai' | 'gemini' | 'anthropic' | string;
export type AITone = 'professional' | 'friendly' | 'casual' | 'formal' | string;

export interface AISettingsResponse {
  id: string;
  organization_id: string;
  organization_name: string;
  is_enabled: boolean;
  provider: AIProvider;
  model_name: string;
  api_key: string | null;
  system_prompt: string;
  tone: AITone;
  temperature: number;
  max_tokens: number;
  fallback_message: string;
  auto_reply_delay_seconds: number;
  business_name: string | null;
  business_description: string | null;
  created_at: string;
  updated_at: string;
}

export type UpdateAISettingsPayload = Partial<
  Omit<AISettingsResponse, 'id' | 'organization_id' | 'organization_name' | 'created_at' | 'updated_at'>
>;

export interface ModelOption {
  id: string;
  label: string;
  tag?: string;
}
