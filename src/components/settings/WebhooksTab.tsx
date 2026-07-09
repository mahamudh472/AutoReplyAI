import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Lock, Copy } from 'lucide-react';
import { WebhookModal } from './WebhookModal';

export const WebhooksTab: React.FC = () => {
  const [webhooks, setWebhooks] = useState<{ id: string; url: string; events: string[]; status: 'active' | 'inactive'; created: string; description: string }[]>(() => {
    const saved = localStorage.getItem('replyai_webhooks');
    return saved ? JSON.parse(saved) : [
      { id: 'wh-1', url: 'https://api.abcstore.com/webhooks/reply', events: ['message.received', 'reply.sent'], status: 'active', created: '2026-06-28', description: 'Customer response handler' },
    ];
  });
  const [showWebhookModal, setShowWebhookModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('replyai_webhooks', JSON.stringify(webhooks));
  }, [webhooks]);

  const handleAddWebhook = (url: string, description: string, events: string[]) => {
    const newWebhook = {
      id: 'wh-' + Date.now(),
      url,
      description: description || 'General events listener',
      events,
      status: 'active' as const,
      created: new Date().toISOString().split('T')[0]
    };

    setWebhooks(prev => [newWebhook, ...prev]);
    setShowWebhookModal(false);
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(wh => wh.id !== id));
  };

  const handleToggleWebhookStatus = (id: string) => {
    setWebhooks(prev => prev.map(wh => {
      if (wh.id === id) {
        return { ...wh, status: wh.status === 'active' ? 'inactive' : 'active' };
      }
      return wh;
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Left Column (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Webhook Endpoints List Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-805 font-outfit">Webhook Endpoints</h3>
              <p className="text-xs text-slate-400 mt-0.5">Receive HTTP POST payloads directly on server when chat events occur.</p>
            </div>
            <button
              onClick={() => setShowWebhookModal(true)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Endpoint
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] text-slate-405 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Endpoint URL</th>
                  <th className="px-4 py-3">Subscribed Events</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {webhooks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      No webhook endpoints configured. Click 'Add Endpoint' to set one up.
                    </td>
                  </tr>
                ) : (
                  webhooks.map((wh) => (
                    <tr key={wh.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-4 max-w-[200px] truncate font-bold text-slate-800" title={wh.url}>
                        {wh.url}
                        <p className="text-[9px] text-slate-400 font-sans mt-0.5 truncate">{wh.description}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {wh.events.map(ev => (
                            <span key={ev} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9px] rounded-md font-semibold border border-slate-200/50">
                              {ev}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleToggleWebhookStatus(wh.id)}
                          className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                            wh.status === 'active' 
                              ? 'bg-green-50 text-green-700 border-green-200/50' 
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}
                        >
                          {wh.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-slate-405">{wh.created}</td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleDeleteWebhook(wh.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Webhook"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Right Column (1/3 width) */}
      <div className="space-y-6">
        
        {/* Recent Webhook Deliveries Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-855 font-outfit">Recent Deliveries</h3>
            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold rounded-lg border border-green-200/50">Live feed</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] font-bold text-slate-700">POST /webhooks/reply</span>
                <span className="text-green-700 font-bold text-[9px] bg-green-50 px-1.5 py-0.5 rounded border border-green-200/50">200 OK</span>
              </div>
              <p className="text-[10px] text-slate-400">Trigger: message.received • 2 mins ago</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] font-bold text-slate-700">POST /webhooks/reply</span>
                <span className="text-green-700 font-bold text-[9px] bg-green-50 px-1.5 py-0.5 rounded border border-green-200/50">200 OK</span>
              </div>
              <p className="text-[10px] text-slate-400">Trigger: reply.sent • 10 mins ago</p>
            </div>

            <div className="text-center pt-2">
              <span className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center justify-center gap-1">
                <span>View Delivery Logs</span>
                <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Webhook Secret Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-805">
            <Lock className="h-4 w-4 text-blue-600" />
            <h4 className="text-xs font-bold font-outfit">Signing Secret</h4>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Use this secret key to sign and verify webhook request signatures to confirm events originate from AutoReply.
          </p>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[10px] font-bold text-slate-600 flex justify-between items-center">
            <code>whsec_v7A83jfZ...k902n</code>
            <button 
              onClick={() => navigator.clipboard.writeText('whsec_v7A83jfZ67h8aB3k902n')}
              className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* WebhookModal Integration */}
      <WebhookModal
        isOpen={showWebhookModal}
        onClose={() => setShowWebhookModal(false)}
        onAdd={handleAddWebhook}
      />
    </div>
  );
};
