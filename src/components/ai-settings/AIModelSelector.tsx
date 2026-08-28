import React from 'react';
import { Sparkles } from 'lucide-react';
import { PROVIDER_MODELS } from '../../constants/aiModels';
import type { AIProvider } from '../../types/ai';

interface AIModelSelectorProps {
  provider: AIProvider;
  modelName: string;
  onProviderChange: (provider: AIProvider) => void;
  onModelChange: (model: string) => void;
}

export const AIModelSelector: React.FC<AIModelSelectorProps> = ({
  provider,
  modelName,
  onProviderChange,
  onModelChange,
}) => {
  return (
    <div className="space-y-4 py-2 border-b border-slate-100 pb-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-blue-600" />
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Provider & Model</h3>
      </div>

      {/* Provider Selection Tabs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'openai', label: 'OpenAI' },
          { id: 'gemini', label: 'Google Gemini' },
          { id: 'anthropic', label: 'Anthropic Claude' },
        ].map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onProviderChange(p.id)}
            className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
              provider === p.id
                ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-sm ring-1 ring-blue-500/20'
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Model Dropdown */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">Model Name</label>
        <select
          value={modelName}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
        >
          {(PROVIDER_MODELS[provider] || []).map((m) => (
            <option key={m.id} value={m.id}>
              {m.label} {m.tag ? `★ (${m.tag})` : ''}
            </option>
          ))}
          {!PROVIDER_MODELS[provider]?.some((m) => m.id === modelName) && (
            <option value={modelName}>{modelName}</option>
          )}
        </select>
      </div>
    </div>
  );
};
