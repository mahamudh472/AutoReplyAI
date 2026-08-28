import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import type { AISettingsResponse, UpdateAISettingsPayload, AIProvider, AITone } from '../types/ai';
import { PROVIDER_MODELS } from '../constants/aiModels';
import {
  AIModelSelector,
  AIBusinessInfoForm,
  AIPersonalityForm,
  AIPlaygroundPreview,
  AIVariablesCard,
  AITipsCard,
} from '../components/ai-settings';
import { HelpCircle, Bell, Check, ChevronDown, AlertCircle, Loader2 } from 'lucide-react';

export const AISettings: React.FC = () => {
  const { organizations, activeOrgId, updateOrgSettings } = useApp();
  const org = organizations.find((o) => o.id === activeOrgId) || organizations[0];

  // Loading & sync state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Settings form states (backed by API schema)
  const [isEnabled, setIsEnabled] = useState(true);
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [modelName, setModelName] = useState('gpt-4o-mini');
  const [tone, setTone] = useState<AITone>('professional');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a helpful, polite, and professional customer support assistant for our business. Reply concisely, clearly, and accurately to customer inquiries.'
  );
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [fallbackMessage, setFallbackMessage] = useState(
    'Thank you for contacting us! A member of our team will review your message and get back to you shortly.'
  );
  const [autoReplyDelaySeconds, setAutoReplyDelaySeconds] = useState(0);

  // Load from GET /api/v1/ai/settings/
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMessage(null);

    api
      .getAISettings()
      .then((data: AISettingsResponse) => {
        if (!isMounted) return;
        setIsEnabled(data.is_enabled);
        setProvider(data.provider || 'openai');
        setModelName(data.model_name || 'gpt-4o-mini');
        setTone(data.tone || 'professional');
        setTemperature(typeof data.temperature === 'number' ? data.temperature : 0.7);
        setMaxTokens(data.max_tokens || 500);
        setSystemPrompt(data.system_prompt || '');
        setBusinessName(data.business_name || '');
        setBusinessDescription(data.business_description || '');
        setFallbackMessage(data.fallback_message || '');
        setAutoReplyDelaySeconds(data.auto_reply_delay_seconds || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to load AI settings from backend API, using local values:', err);
        if (!isMounted) return;
        setIsEnabled(org.aiEnabled ?? true);
        setProvider(org.model === 'Gemini' ? 'gemini' : org.model === 'Claude' ? 'anthropic' : 'openai');
        setModelName(
          org.model === 'Gemini'
            ? 'gemini-1.5-flash'
            : org.model === 'Claude'
            ? 'claude-3-5-sonnet-20241022'
            : 'gpt-4o-mini'
        );
        setSystemPrompt(org.prompt || '');
        setTemperature(org.temperature ?? 0.7);
        setMaxTokens(org.maxTokens || 500);
        setBusinessName(org.name || '');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeOrgId, org.aiEnabled, org.model, org.name, org.prompt, org.temperature, org.maxTokens]);

  const handleProviderChange = (newProvider: AIProvider) => {
    setProvider(newProvider);
    const available = PROVIDER_MODELS[newProvider];
    if (available && available.length > 0) {
      setModelName(available[0].id);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    const payload: UpdateAISettingsPayload = {
      is_enabled: isEnabled,
      provider,
      model_name: modelName,
      tone,
      temperature,
      max_tokens: maxTokens,
      business_name: businessName.trim() ? businessName.trim() : null,
      business_description: businessDescription.trim() ? businessDescription.trim() : null,
      system_prompt: systemPrompt,
      fallback_message: fallbackMessage,
      auto_reply_delay_seconds: autoReplyDelaySeconds,
    };

    try {
      const updated = await api.updateAISettings(payload);
      if (updated) {
        setIsEnabled(updated.is_enabled);
        setProvider(updated.provider);
        setModelName(updated.model_name);
        setTone(updated.tone);
        setTemperature(updated.temperature);
        setMaxTokens(updated.max_tokens);
        setSystemPrompt(updated.system_prompt);
        setBusinessName(updated.business_name || '');
        setBusinessDescription(updated.business_description || '');
        setFallbackMessage(updated.fallback_message || '');
        setAutoReplyDelaySeconds(updated.auto_reply_delay_seconds || 0);
      }
    } catch (err: any) {
      console.warn('API PATCH /api/v1/ai/settings/ failed, saving to local context:', err);
    }

    updateOrgSettings({
      aiEnabled: isEnabled,
      model: provider === 'gemini' ? 'Gemini' : provider === 'anthropic' ? 'Claude' : 'GPT-4.1',
      prompt: systemPrompt,
      temperature,
      maxTokens,
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-xs font-semibold">Loading AI configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-700">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 font-outfit">AI Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Configure and tune how AutoReply AI represents your organization.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
            <span className="h-4 w-4 bg-blue-600 rounded text-white flex items-center justify-center text-[9px] font-bold">
              {businessName ? businessName.charAt(0).toUpperCase() : org.name ? org.name.charAt(0).toUpperCase() : 'A'}
            </span>
            <span>{businessName || org.name || 'Primary Organization'}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>

          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
            <HelpCircle className="h-4.5 w-4.5" />
          </button>

          <button className="relative p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white"></span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            {/* AI Status Row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Status</h3>
                <p className="text-xs text-slate-400 mt-1">Enable or disable automated AI responses for incoming customer messages.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold ${isEnabled ? 'text-blue-600' : 'text-slate-400'}`}>
                  {isEnabled ? 'AI Active' : 'AI Disabled'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Business Information */}
            <AIBusinessInfoForm
              businessName={businessName}
              businessDescription={businessDescription}
              onBusinessNameChange={setBusinessName}
              onBusinessDescriptionChange={setBusinessDescription}
            />

            {/* Provider & Model Selection */}
            <AIModelSelector
              provider={provider}
              modelName={modelName}
              onProviderChange={handleProviderChange}
              onModelChange={setModelName}
            />

            {/* Personality & Hyperparameters */}
            <AIPersonalityForm
              tone={tone}
              temperature={temperature}
              maxTokens={maxTokens}
              autoReplyDelaySeconds={autoReplyDelaySeconds}
              fallbackMessage={fallbackMessage}
              systemPrompt={systemPrompt}
              provider={provider}
              modelName={modelName}
              onToneChange={setTone}
              onTemperatureChange={setTemperature}
              onMaxTokensChange={setMaxTokens}
              onAutoReplyDelayChange={setAutoReplyDelaySeconds}
              onFallbackMessageChange={setFallbackMessage}
              onSystemPromptChange={setSystemPrompt}
            />

            {/* Save Changes Button */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-500/10 text-xs flex items-center gap-2 active:scale-95 disabled:opacity-50 glow-primary cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    Settings Saved
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Right Column: Previews and Guidelines */}
        <div className="space-y-6">
          <AIPlaygroundPreview tone={tone} provider={provider} businessName={businessName} />
          <AIVariablesCard />
          <AITipsCard />
        </div>
      </div>
    </div>
  );
};
