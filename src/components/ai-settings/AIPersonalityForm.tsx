import React, { useState } from 'react';
import {
  MessageSquare,
  Sliders,
  HelpCircle,
  ChevronDown,
  Bold,
  Italic,
  List,
  Code,
  Link as LinkIcon,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import type { AITone, AIProvider } from '../../types/ai';

interface AIPersonalityFormProps {
  tone: AITone;
  temperature: number;
  maxTokens: number;
  autoReplyDelaySeconds: number;
  fallbackMessage: string;
  systemPrompt: string;
  provider: AIProvider;
  modelName: string;
  onToneChange: (tone: AITone) => void;
  onTemperatureChange: (temp: number) => void;
  onMaxTokensChange: (tokens: number) => void;
  onAutoReplyDelayChange: (delay: number) => void;
  onFallbackMessageChange: (msg: string) => void;
  onSystemPromptChange: (prompt: string) => void;
}

export const AIPersonalityForm: React.FC<AIPersonalityFormProps> = ({
  tone,
  temperature,
  maxTokens,
  autoReplyDelaySeconds,
  fallbackMessage,
  systemPrompt,
  provider,
  modelName,
  onToneChange,
  onTemperatureChange,
  onMaxTokensChange,
  onAutoReplyDelayChange,
  onFallbackMessageChange,
  onSystemPromptChange,
}) => {
  const [showVariablesDropdown, setShowVariablesDropdown] = useState(false);

  const handleInsertVariable = (variable: string) => {
    onSystemPromptChange(systemPrompt + ` {{${variable}}}`);
    setShowVariablesDropdown(false);
  };

  return (
    <>
      {/* Tone & Response Style */}
      <div className="space-y-4 py-2 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tone & Personality</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'professional', label: 'Professional', desc: 'Clear & courteous' },
            { id: 'friendly', label: 'Friendly', desc: 'Warm & welcoming' },
            { id: 'casual', label: 'Casual', desc: 'Relaxed & approachable' },
            { id: 'formal', label: 'Formal', desc: 'Structured & polite' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onToneChange(t.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                tone === t.id
                  ? 'border-blue-600 bg-blue-50/40 text-blue-600 ring-1 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <p className="text-xs font-bold">{t.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Model Hyperparameters (Sliders) */}
      <div className="space-y-4 py-2 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-blue-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hyperparameters</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Temperature */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 flex items-center gap-1">
                Temperature
                <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
              </span>
              <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-750 font-bold text-[10px]">
                {temperature}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
              className="w-full accent-blue-600 bg-slate-100 rounded-lg appearance-none h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>0.0 (Precise / Factual)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 flex items-center gap-1">
                Max Tokens
                <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
              </span>
              <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-750 font-bold text-[10px]">
                {maxTokens}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={maxTokens}
              onChange={(e) => onMaxTokensChange(parseInt(e.target.value))}
              className="w-full accent-blue-600 bg-slate-100 rounded-lg appearance-none h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>100 (Concise)</span>
              <span>1500 (Detailed)</span>
            </div>
          </div>
        </div>

        {/* Delay & Fallback */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Auto Reply Delay (seconds)</label>
            <input
              type="number"
              min="0"
              max="60"
              value={autoReplyDelaySeconds}
              onChange={(e) => onAutoReplyDelayChange(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
            />
            <p className="text-[10px] text-slate-400">Natural pause before dispatching response (0 for immediate).</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Fallback Message</label>
            <input
              type="text"
              value={fallbackMessage}
              onChange={(e) => onFallbackMessageChange(e.target.value)}
              placeholder="Message sent when AI cannot answer"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Prompt Editor Box */}
      <div className="space-y-3.5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">System Prompt</h3>
            <p className="text-xs text-slate-400 mt-1">Direct instructions given to the LLM to guide customer interactions.</p>
          </div>

          {/* Insert Variable Select Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowVariablesDropdown(!showVariablesDropdown)}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-blue-600 flex items-center gap-1 shadow-sm cursor-pointer"
            >
              Insert variable <ChevronDown className="h-3 w-3" />
            </button>
            {showVariablesDropdown && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowVariablesDropdown(false)}></div>
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-40 p-1 text-xs">
                  {['company_name', 'customer_name', 'current_date', 'current_time', 'platform'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleInsertVariable(v)}
                      className="w-full text-left p-2 hover:bg-slate-50 rounded-lg font-semibold text-slate-700 cursor-pointer"
                    >
                      {'{{' + v + '}}'}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Editor Box */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Toolbar */}
          <div className="bg-slate-50/50 border-b border-slate-150 p-2.5 flex gap-1.5 text-slate-500">
            <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded cursor-pointer">
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded cursor-pointer">
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded cursor-pointer">
              <List className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded cursor-pointer">
              <Code className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded cursor-pointer">
              <LinkIcon className="h-3.5 w-3.5" />
            </button>
            <div className="w-[1px] bg-slate-250 my-1 mx-1.5"></div>
            <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded cursor-pointer">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded cursor-pointer">
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <textarea
            value={systemPrompt}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            rows={8}
            className="w-full p-4 bg-white text-slate-800 text-xs font-mono focus:outline-none leading-relaxed resize-y"
            placeholder="You are customer support assistant..."
          />

          {/* Bottom line */}
          <div className="px-4 py-2 border-t border-slate-150 bg-slate-50/50 flex justify-between items-center text-[10px] text-slate-400 font-medium">
            <span>{systemPrompt.length} characters</span>
            <span className="text-blue-600 font-semibold font-mono">
              {provider} / {modelName}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
