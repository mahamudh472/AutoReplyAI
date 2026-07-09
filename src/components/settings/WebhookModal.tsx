import React, { useState } from 'react';
import { Link2 } from 'lucide-react';

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (url: string, description: string, events: string[]) => void;
}

export const WebhookModal: React.FC<WebhookModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookDesc, setWebhookDesc] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['message.received']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim() || selectedEvents.length === 0) return;
    onAdd(webhookUrl, webhookDesc, selectedEvents);
    setWebhookUrl('');
    setWebhookDesc('');
    setSelectedEvents(['message.received']);
  };

  const handleToggleEvent = (event: string) => {
    setSelectedEvents(prev => 
      prev.includes(event) 
        ? prev.filter(e => e !== event) 
        : [...prev, event]
    );
  };

  const handleClose = () => {
    setWebhookUrl('');
    setWebhookDesc('');
    setSelectedEvents(['message.received']);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose}></div>
      
      <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl w-full max-w-md mx-4 space-y-5 animate-slide-in">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Link2 className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-850 font-outfit">Add Webhook Endpoint</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Subscribe to chat events.</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold text-slate-400">Endpoint URL</label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://api.yourdomain.com/webhook"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold shadow-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold text-slate-400">Description (Optional)</label>
            <input
              type="text"
              value={webhookDesc}
              onChange={(e) => setWebhookDesc(e.target.value)}
              placeholder="e.g. Handle slack reports, log to database"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold shadow-sm"
            />
          </div>

          {/* Event Subscriptions Checklist */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-slate-400">Event Subscriptions</label>
            
            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="ev-received"
                  checked={selectedEvents.includes('message.received')}
                  onChange={() => handleToggleEvent('message.received')}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="ev-received" className="text-xs text-slate-655 font-medium leading-normal cursor-pointer select-none">
                  <strong>message.received</strong>
                  <p className="text-[9px] text-slate-400">Fired when a customer sends a message.</p>
                </label>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="ev-sent"
                  checked={selectedEvents.includes('reply.sent')}
                  onChange={() => handleToggleEvent('reply.sent')}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="ev-sent" className="text-xs text-slate-655 font-medium leading-normal cursor-pointer select-none">
                  <strong>reply.sent</strong>
                  <p className="text-[9px] text-slate-400">Fired when the AI or a team member replies.</p>
                </label>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="ev-closed"
                  checked={selectedEvents.includes('conversation.closed')}
                  onChange={() => handleToggleEvent('conversation.closed')}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="ev-closed" className="text-xs text-slate-655 font-medium leading-normal cursor-pointer select-none">
                  <strong>conversation.closed</strong>
                  <p className="text-[9px] text-slate-400">Fired when a chat thread is marked closed.</p>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-slate-200 text-slate-655 hover:bg-slate-50 font-bold rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedEvents.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Add Endpoint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
