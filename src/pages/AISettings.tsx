import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api, type AISettingsResponse, type UpdateAISettingsPayload } from '../utils/api';
import { 
  HelpCircle, 
  Bell, 
  Check, 
  ChevronDown,
  RotateCw,
  Lightbulb,
  ArrowUpRight,
  ChevronRight,
  Bold,
  Italic,
  List,
  Code,
  Link as LinkIcon,
  RotateCcw,
  Sparkles,
  Building2,
  Sliders,
  MessageSquare,
  AlertCircle,
  Loader2
} from 'lucide-react';

const PROVIDER_MODELS: Record<string, { id: string; label: string; tag?: string }[]> = {
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

export const AISettings: React.FC = () => {
  const { organizations, activeOrgId, updateOrgSettings } = useApp();
  const org = organizations.find(o => o.id === activeOrgId) || organizations[0];

  // Loading & sync state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Settings form states (backed by API schema)
  const [isEnabled, setIsEnabled] = useState(true);
  const [provider, setProvider] = useState<'openai' | 'gemini' | 'anthropic' | string>('openai');
  const [modelName, setModelName] = useState('gpt-4o-mini');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'casual' | 'formal' | string>('professional');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful, polite, and professional customer support assistant for our business. Reply concisely, clearly, and accurately to customer inquiries."
  );
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [fallbackMessage, setFallbackMessage] = useState(
    "Thank you for contacting us! A member of our team will review your message and get back to you shortly."
  );
  const [autoReplyDelaySeconds, setAutoReplyDelaySeconds] = useState(0);

  const [showVariablesDropdown, setShowVariablesDropdown] = useState(false);
  const [previewCustomerQuery, setPreviewCustomerQuery] = useState('Do you offer international shipping?');

  // Load from GET /api/v1/ai/settings/
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMessage(null);

    api.getAISettings()
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
        // Fallback to local org context values
        setIsEnabled(org.aiEnabled ?? true);
        setProvider(org.model === 'Gemini' ? 'gemini' : org.model === 'Claude' ? 'anthropic' : 'openai');
        setModelName(org.model === 'Gemini' ? 'gemini-1.5-flash' : org.model === 'Claude' ? 'claude-3-5-sonnet-20241022' : 'gpt-4o-mini');
        setSystemPrompt(org.prompt || '');
        setTemperature(org.temperature ?? 0.7);
        setMaxTokens(org.maxTokens || 500);
        setBusinessName(org.name || '');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeOrgId]);

  // Handle Provider Change
  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    const available = PROVIDER_MODELS[newProvider];
    if (available && available.length > 0) {
      setModelName(available[0].id);
    }
  };

  // Submit PATCH /api/v1/ai/settings/
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
      auto_reply_delay_seconds: autoReplyDelaySeconds
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

    // Sync to local AppContext
    updateOrgSettings({
      aiEnabled: isEnabled,
      model: provider === 'gemini' ? 'Gemini' : provider === 'anthropic' ? 'Claude' : 'GPT-4.1',
      prompt: systemPrompt,
      temperature,
      maxTokens
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleInsertVariable = (variable: string) => {
    setSystemPrompt(prev => prev + ` {{${variable}}}`);
    setShowVariablesDropdown(false);
  };

  const cyclePreviewQuery = () => {
    const queries = [
      'Do you offer international shipping?',
      'What are your store business hours?',
      'Can I return an item after 30 days?',
      'Are the keyboards hot-swappable?',
      'Do you have any discount promo codes?'
    ];
    const currentIndex = queries.indexOf(previewCustomerQuery);
    const nextIndex = (currentIndex + 1) % queries.length;
    setPreviewCustomerQuery(queries[nextIndex]);
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
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 font-outfit">AI Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Configure and tune how AutoReply AI represents your organization.</p>
        </div>

        {/* Header Right widgets */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
            <span className="h-4 w-4 bg-blue-600 rounded text-white flex items-center justify-center text-[9px] font-bold">
              {businessName ? businessName.charAt(0).toUpperCase() : (org.name ? org.name.charAt(0).toUpperCase() : 'A')}
            </span>
            <span>{businessName || org.name || 'Primary Organization'}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>

          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
            <HelpCircle className="h-4.5 w-4.5" />
          </button>
          
          <button className="relative p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
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

      {/* 2. Settings Grid (Left: form fields, Right: preview & variable help) */}
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
            <div className="space-y-4 py-2 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Business Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Business Description</label>
                  <input
                    type="text"
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="e.g. Online store selling premium custom mechanical keyboards."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
                  />
                  <p className="text-[10px] text-slate-400">Gives AI the foundation context about what your business offers.</p>
                </div>
              </div>
            </div>

            {/* Provider & Model Selection */}
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
                  { id: 'anthropic', label: 'Anthropic Claude' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleProviderChange(p.id)}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
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
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                >
                  {(PROVIDER_MODELS[provider] || []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} {m.tag ? `★ (${m.tag})` : ''}
                    </option>
                  ))}
                  {/* Fallback if model not in preset list */}
                  {!PROVIDER_MODELS[provider]?.some(m => m.id === modelName) && (
                    <option value={modelName}>{modelName}</option>
                  )}
                </select>
              </div>
            </div>

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
                  { id: 'formal', label: 'Formal', desc: 'Structured & polite' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
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
                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-750 font-bold text-[10px]">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
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
                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-750 font-bold text-[10px]">{maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    step="50"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
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
                    onChange={(e) => setAutoReplyDelaySeconds(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
                  />
                  <p className="text-[10px] text-slate-400">Natural pause before dispatching response (0 for immediate).</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Fallback Message</label>
                  <input
                    type="text"
                    value={fallbackMessage}
                    onChange={(e) => setFallbackMessage(e.target.value)}
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
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-blue-600 flex items-center gap-1 shadow-sm"
                  >
                    Insert variable <ChevronDown className="h-3 w-3" />
                  </button>
                  {showVariablesDropdown && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowVariablesDropdown(false)}></div>
                      <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-40 p-1 text-xs">
                        {['company_name', 'customer_name', 'current_date', 'current_time', 'platform'].map(v => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => handleInsertVariable(v)}
                            className="w-full text-left p-2 hover:bg-slate-50 rounded-lg font-semibold text-slate-700"
                          >
                            {"{{" + v + "}}"}
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
                  <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded"><Bold className="h-3.5 w-3.5" /></button>
                  <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded"><Italic className="h-3.5 w-3.5" /></button>
                  <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded"><List className="h-3.5 w-3.5" /></button>
                  <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded"><Code className="h-3.5 w-3.5" /></button>
                  <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded"><LinkIcon className="h-3.5 w-3.5" /></button>
                  <div className="w-[1px] bg-slate-250 my-1 mx-1.5"></div>
                  <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded"><RotateCcw className="h-3.5 w-3.5" /></button>
                  <button type="button" className="p-1.5 hover:bg-slate-200/50 hover:text-slate-800 rounded"><RotateCw className="h-3.5 w-3.5" /></button>
                </div>

                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
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

            {/* Bottom Save Changes Bar */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-500/10 text-xs flex items-center gap-2 active:scale-95 disabled:opacity-50 glow-primary"
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
          
          {/* AI Response Preview Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-outfit">AI Response Preview</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Simulated with <span className="font-semibold text-slate-600">{tone}</span> tone
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-600 text-[9px] font-bold uppercase">
                {provider}
              </span>
            </div>

            {/* Preview Chat Panel */}
            <div className="border border-slate-150 rounded-2xl p-4 bg-[#fbfcfd] space-y-3">
              {/* Customer */}
              <div className="flex justify-end">
                <div className="px-3.5 py-2 bg-blue-50 text-blue-800 rounded-2xl rounded-tr-none text-xs max-w-[85%] font-medium">
                  {previewCustomerQuery}
                </div>
              </div>

              {/* AI */}
              <div className="flex justify-start items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[10px]">
                  🤖
                </div>
                <div className="px-3.5 py-2 bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none text-xs leading-normal max-w-[85%] shadow-sm">
                  {tone === 'friendly' 
                    ? `Hello! 😊 Yes, ${businessName || 'our store'} offers fast shipping worldwide! Standard shipping takes 3-5 business days and is calculated at checkout. Let me know if you need help with anything else!`
                    : tone === 'formal'
                    ? `Greetings. Please be advised that ${businessName || 'our company'} provides shipping services domestically and internationally. Full rates and estimated timelines are presented during checkout.`
                    : tone === 'casual'
                    ? `Hey there! Yeah, we definitely ship worldwide. Super quick 3-5 days delivery. You can check rates directly in the cart!`
                    : `Hello! Yes, ${businessName || 'our business'} provides worldwide shipping. Standard delivery takes 3-5 business days, and exact rates are calculated at checkout before order confirmation.`}
                </div>
              </div>
            </div>

            <button 
              type="button"
              onClick={cyclePreviewQuery}
              className="w-full py-2.5 rounded-xl border border-blue-600/30 hover:bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Test another query
            </button>
          </div>

          {/* Variables References Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-outfit">Dynamic Variables</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Use variables to personalize AI responses dynamically.</p>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex justify-between py-2 items-center">
                <span className="font-mono font-bold text-blue-600">{"{{company_name}}"}</span>
                <span className="text-slate-500">Your organization name</span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="font-mono font-bold text-blue-600">{"{{customer_name}}"}</span>
                <span className="text-slate-500">Customer's name</span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="font-mono font-bold text-blue-600">{"{{current_date}}"}</span>
                <span className="text-slate-500">Current date</span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="font-mono font-bold text-blue-600">{"{{current_time}}"}</span>
                <span className="text-slate-500">Current time</span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="font-mono font-bold text-blue-600">{"{{platform}}"}</span>
                <span className="text-slate-500">Platform name</span>
              </div>
            </div>

            <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:text-blue-700">
              View all variables <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Tips Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-outfit">
              <Lightbulb className="h-4.5 w-4.5 text-blue-600" />
              Tips for Best Results
            </h3>

            <ul className="list-disc list-outside pl-4 space-y-2 text-xs text-slate-500">
              <li>Keep business descriptions clear and focused on customer FAQs.</li>
              <li>Use temperature between 0.3 - 0.7 for high factual consistency.</li>
              <li>Specify explicit fallback behavior when inquiries require escalation.</li>
            </ul>

            <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:text-blue-700">
              Learn more about prompt tuning <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
