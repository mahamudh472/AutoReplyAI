import React, { useState, useEffect } from 'react';
import { Plus, Check, Copy, Trash2, Terminal, ExternalLink } from 'lucide-react';
import { ApiKeyModal } from './ApiKeyModal';

export const APIKeysTab: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; key: string; created: string; lastUsed: string; scope: 'Full Access' | 'Read Only' }[]>(() => {
    const saved = localStorage.getItem('replyai_api_keys');
    return saved ? JSON.parse(saved) : [
      { id: 'api-1', name: 'Production Live Bot', key: 'ara_live_51O9A83jfZ67h8aB3k92lPoXq', created: '2026-06-25', lastUsed: '5 mins ago', scope: 'Full Access' },
      { id: 'api-2', name: 'Staging Sandbox Testing', key: 'ara_test_51O9A83jfZ89e7d9k02xLmNh9', created: '2026-07-01', lastUsed: '3 days ago', scope: 'Read Only' },
    ];
  });
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('replyai_api_keys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const handleGenerateKey = (name: string, scope: 'Full Access' | 'Read Only') => {
    const randomChars = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const prefix = scope === 'Full Access' ? 'ara_live_' : 'ara_test_';
    const newSecret = `${prefix}${randomChars.substring(0, 16)}`;
    
    const newKey = {
      id: 'api-' + Date.now(),
      name,
      key: newSecret,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      scope
    };

    setApiKeys(prev => [newKey, ...prev]);
    setGeneratedKey(newSecret);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };

  const handleCopyKey = (keyString: string, id: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Left Column (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* API Keys Table Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-805 font-outfit">Active Developer API Keys</h3>
              <p className="text-xs text-slate-400 mt-0.5">Use these keys to access the AutoReply query and draft generator API endpoints.</p>
            </div>
            <button
              onClick={() => {
                setGeneratedKey('');
                setShowApiKeyModal(true);
              }}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Generate Key
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Key Name</th>
                  <th className="px-4 py-3">Token Prefix</th>
                  <th className="px-4 py-3">Permissions</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Last Used</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-4 font-bold text-slate-800">{apiKey.name}</td>
                    <td className="px-4 py-4 font-mono font-medium text-slate-500">
                      <code>{apiKey.key.substring(0, 10)}...</code>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
                        apiKey.scope === 'Full Access' 
                          ? 'bg-blue-50 text-blue-700 border-blue-200/50' 
                          : 'bg-purple-50 text-purple-750 border-purple-200/50'
                      }`}>
                        {apiKey.scope}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-405">{apiKey.created}</td>
                    <td className="px-4 py-4 text-slate-405">{apiKey.lastUsed}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-150 transition-colors cursor-pointer"
                          title="Copy full key"
                        >
                          {copiedKeyId === apiKey.id ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDeleteKey(apiKey.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Key"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Right Column (1/3 width) */}
      <div className="space-y-6">
        
        {/* Quick Developer Guide Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-805 font-outfit font-medium">Quick Usage Guide</h3>
          </div>

          <div className="space-y-3.5">
            <p className="text-[10px] text-slate-400 leading-normal">
              Pass your API key in the authorization header as a Bearer Token to hit our secure webhook endpoints.
            </p>

            <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[9px] overflow-x-auto leading-relaxed border border-slate-850">
              <span className="text-blue-400">curl</span> -X POST https://api.autoreply.ai/v1/chats \<br />
              &nbsp;&nbsp;-H <span className="text-green-300">"Authorization: Bearer ara_live_..."</span> \<br />
              &nbsp;&nbsp;-d <span className="text-green-300">{"'{\"message\": \"Hello support\"}'"}</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
              <span>View full developer documentation</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        </div>

      </div>

      {/* ApiKeyModal Integration */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onGenerate={handleGenerateKey}
        generatedKey={generatedKey}
        onCopy={(k) => handleCopyKey(k, 'gen')}
        copied={copiedKeyId === 'gen'}
      />
    </div>
  );
};
