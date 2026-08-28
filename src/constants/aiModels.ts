import type { ModelOption } from '../types/ai';

export const PROVIDER_MODELS: Record<string, ModelOption[]> = {
  openai: [
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast & Efficient)', tag: 'Recommended' },
    { id: 'gpt-4o', label: 'GPT-4o (High Intelligence)' },
    { id: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  gemini: [
    { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Ultra Fast)', tag: 'Recommended' },
    { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Deep Reasoning)' },
    { id: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash' },
  ],
  anthropic: [
    { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (Nuanced & Natural)', tag: 'Recommended' },
    { id: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Lightweight)' },
  ],
};
