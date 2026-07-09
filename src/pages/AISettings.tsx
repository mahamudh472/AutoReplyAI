import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HelpCircle, 
  Bell, 
  Check, 
  Zap, 
  FileText, 
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
  RotateCcw
} from 'lucide-react';

export const AISettings: React.FC = () => {
  const { organizations, activeOrgId, updateOrgSettings } = useApp();
  
  const org = organizations.find(o => o.id === activeOrgId) || organizations[0];
  
  // Local form states synced with org settings
  const [aiEnabled, setAiEnabled] = useState(org.aiEnabled);
  const [aiMode, setAiMode] = useState(org.aiMode);
  const [model, setModel] = useState(org.model || 'GPT-4.1');
  const [prompt, setPrompt] = useState(org.prompt);
  const [temperature, setTemperature] = useState(org.temperature);
  const [maxTokens, setMaxTokens] = useState(org.maxTokens || 600);
  
  const [saved, setSaved] = useState(false);
  const [showVariablesDropdown, setShowVariablesDropdown] = useState(false);

  // Sync state if org changes
  useEffect(() => {
    setAiEnabled(org.aiEnabled);
    setAiMode(org.aiMode);
    setModel(org.model || 'GPT-4o');
    setPrompt(org.prompt);
    setTemperature(org.temperature);
    setMaxTokens(org.maxTokens || 600);
  }, [org]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrgSettings({
      aiEnabled,
      aiMode,
      model: model as any,
      prompt,
      temperature,
      maxTokens
    });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleInsertVariable = (variable: string) => {
    setPrompt(prev => prev + ` {{${variable}}}`);
    setShowVariablesDropdown(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-700">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-805 font-outfit">AI Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Configure how AutoReply AI responds to your customers.</p>
        </div>

        {/* Header Right widgets */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
            <span className="h-4 w-4 bg-blue-600 rounded text-white flex items-center justify-center text-[9px] font-bold">A</span>
            <span>ABC Store</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>

          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-405 hover:text-slate-655 shadow-sm hover:bg-slate-50 transition-colors">
            <HelpCircle className="h-4.5 w-4.5" />
          </button>
          
          <button className="relative p-2 bg-white border border-slate-200 rounded-xl text-slate-405 hover:text-slate-655 shadow-sm hover:bg-slate-50 transition-colors">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white"></span>
          </button>
        </div>
      </div>

      {/* 2. Settings Grid (Left: form fields, Right: preview & variable help) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form Fields */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* AI Status Row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Status</h3>
                <p className="text-xs text-slate-400 mt-1">Turn AI replies on or off for your organization.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">AI is enabled</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiEnabled}
                    onChange={(e) => setAiEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Reply Mode Row */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 py-2 border-b border-slate-100 pb-5">
              <div className="max-w-xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Reply Mode</h3>
                <p className="text-xs text-slate-400 mt-1">Choose how AI should reply to incoming messages.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-md">
                {/* Automatic Button Card */}
                <button
                  type="button"
                  onClick={() => setAiMode('Automatic')}
                  className={`flex-1 p-4 rounded-xl border text-left space-y-1.5 transition-all ${
                    aiMode === 'Automatic' 
                      ? 'border-blue-600 bg-blue-50/30 text-blue-600 ring-1 ring-blue-500/20' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${aiMode === 'Automatic' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Automatic</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">AI replies instantly to customers.</p>
                </button>

                {/* Draft Button Card */}
                <button
                  type="button"
                  onClick={() => setAiMode('Draft Only')}
                  className={`flex-1 p-4 rounded-xl border text-left space-y-1.5 transition-all ${
                    aiMode === 'Draft Only' 
                      ? 'border-blue-600 bg-blue-50/30 text-blue-600 ring-1 ring-blue-500/20' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${aiMode === 'Draft Only' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <FileText className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Draft</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">AI generates a draft and you review before sending.</p>
                </button>
              </div>
            </div>

            {/* AI Model Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Model</h3>
                <p className="text-xs text-slate-400 mt-1">Select the AI model to generate responses.</p>
              </div>

              <div className="w-full md:max-w-xs space-y-1.5 text-right">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                >
                  <option value="GPT-4.1">GPT-4o (Recommended)</option>
                  <option value="Claude">Claude 3.5 Sonnet</option>
                  <option value="Gemini">Gemini Pro 1.5</option>
                  <option value="GPT-5.5">GPT-4 Turbo</option>
                </select>
                <div className="flex justify-end">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                    Best balance of speed and quality
                  </span>
                </div>
              </div>
            </div>

            {/* Response Settings Sliders */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 py-2 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Response Settings</h3>
                <p className="text-xs text-slate-400 mt-1">Adjust the AI behavior and response style.</p>
              </div>

              <div className="w-full md:max-w-md space-y-5">
                {/* Temperature */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 flex items-center gap-1">
                      Temperature
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                    </span>
                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-750 font-bold text-[10px] w-8 text-center">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 bg-slate-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                    <span>0 (Precise)</span>
                    <span>1 (Creative)</span>
                  </div>
                </div>

                {/* Max Response Length */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 flex items-center gap-1">
                      Max Response Length
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                    </span>
                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-750 font-bold text-[10px] w-10 text-center">{maxTokens}</span>
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
                    <span>Shorter</span>
                    <span>Longer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Editor Box */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Prompt</h3>
                  <p className="text-xs text-slate-400 mt-1">Set the instructions for AI to follow while chatting with your customers.</p>
                </div>
                
                {/* Insert Variable Select Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowVariablesDropdown(!showVariablesDropdown)}
                    className="px-3 py-1.5 border border-slate-250 hover:bg-slate-50 rounded-xl text-xs font-bold text-blue-600 flex items-center gap-1 shadow-sm"
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
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={8}
                  className="w-full p-4 bg-white text-slate-800 text-xs font-mono focus:outline-none leading-relaxed resize-y"
                  placeholder="You are customer support assistant..."
                />

                {/* Bottom line */}
                <div className="px-4 py-2 border-t border-slate-150 bg-slate-50/50 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                  <span>{prompt.length} characters</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Prompt saved
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Save Changes Bar */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-500/10 text-xs flex items-center gap-2 active:scale-95"
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    Changes Saved
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>

          </div>
        </form>

        {/* Right Column: Previews and Guidelines */}
        <div className="space-y-6">
          
          {/* AI Response Preview Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-805 font-outfit">AI Response Preview</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">See how AI might respond to a customer.</p>
            </div>

            {/* Preview Chat Panel */}
            <div className="border border-slate-150 rounded-2xl p-4 bg-[#fbfcfd] space-y-3">
              {/* Customer */}
              <div className="flex justify-end">
                <div className="px-3.5 py-2 bg-blue-50 text-blue-800 rounded-2xl rounded-tr-none text-xs max-w-[85%] font-medium">
                  Do you offer international shipping?
                </div>
              </div>

              {/* AI */}
              <div className="flex justify-start items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[10px]">
                  🤖
                </div>
                <div className="px-3.5 py-2 bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none text-xs leading-normal max-w-[85%]">
                  Yes! We offer international shipping to most countries. Shipping fees and delivery times may vary depending on your location. You can check the exact shipping cost at checkout before placing your order.
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl border border-blue-600/30 hover:bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
              <RotateCw className="h-3.5 w-3.5" />
              Test another message
            </button>
          </div>

          {/* Variables References Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-805 font-outfit">Variables</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Use variables to personalize AI responses.</p>
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
            <h3 className="text-sm font-bold text-slate-805 flex items-center gap-2 font-outfit">
              <Lightbulb className="h-4.5 w-4.5 text-blue-650" />
              Tips
            </h3>

            <ul className="list-disc list-outside pl-4 space-y-2 text-xs text-slate-500">
              <li>Be specific about your products and services.</li>
              <li>Include details about shipping, returns, and policies.</li>
              <li>Tell AI when to escalate to a human agent.</li>
              <li>Keep instructions clear and concise.</li>
            </ul>

            <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:text-blue-700">
              Learn more about prompt engineering <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
