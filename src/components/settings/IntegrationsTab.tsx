import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Globe, Link2 } from 'lucide-react';
import { FacebookIcon, InstagramIcon, SlackIcon } from '../SocialIcons';

export const IntegrationsTab: React.FC = () => {
  const { connections, toggleConnection } = useApp();

  // Shopify mock state
  const [shopifyConnected, setShopifyConnected] = useState(false);
  const [shopifyStoreUrl] = useState('abc-store.myshopify.com');
  
  // Slack mock state
  const [slackConnected, setSlackConnected] = useState(false);
  const [slackChannel] = useState('#customer-support');

  // WhatsApp mock state
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [whatsappNumber] = useState('+1 (555) 019-2834');

  // Zapier mock state
  const [zapierConnected, setZapierConnected] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Integration 1: Facebook Pages */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[210px]">
        <div>
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <FacebookIcon className="h-6 w-6" />
            </div>
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
              connections.find(c => c.platform === 'facebook')?.connected
                ? 'bg-green-50 text-green-700 border-green-200/50'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              {connections.find(c => c.platform === 'facebook')?.connected ? 'Active' : 'Not Connected'}
            </span>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-800">Facebook Business Pages</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
              Sync incoming Facebook comments and messenger chats for automated replies.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[9px] text-slate-450 font-bold truncate max-w-[50%]">
            {connections.find(c => c.platform === 'facebook')?.connected 
              ? connections.find(c => c.platform === 'facebook')?.pageName
              : 'No pages connected'
            }
          </span>
          <button
            onClick={() => toggleConnection('facebook')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              connections.find(c => c.platform === 'facebook')?.connected
                ? 'text-rose-600 hover:bg-rose-50 border border-transparent'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm'
            }`}
          >
            {connections.find(c => c.platform === 'facebook')?.connected ? 'Disconnect' : 'Connect Page'}
          </button>
        </div>
      </div>

      {/* Integration 2: Instagram */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[210px]">
        <div>
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500">
              <InstagramIcon className="h-6 w-6" />
            </div>
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
              connections.find(c => c.platform === 'instagram')?.connected
                ? 'bg-green-50 text-green-700 border-green-200/50'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              {connections.find(c => c.platform === 'instagram')?.connected ? 'Active' : 'Not Connected'}
            </span>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-800">Instagram Feed & Comments</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
              AutoReply to direct messages (DMs) and post comments instantly via AI models.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[9px] text-slate-450 font-bold truncate max-w-[50%]">
            {connections.find(c => c.platform === 'instagram')?.connected 
              ? connections.find(c => c.platform === 'instagram')?.pageName
              : 'No profile connected'
            }
          </span>
          <button
            onClick={() => toggleConnection('instagram')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              connections.find(c => c.platform === 'instagram')?.connected
                ? 'text-rose-600 hover:bg-rose-50 border border-transparent'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm'
            }`}
          >
            {connections.find(c => c.platform === 'instagram')?.connected ? 'Disconnect' : 'Connect Profile'}
          </button>
        </div>
      </div>

      {/* Integration 3: Slack */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[210px]">
        <div>
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-[#4A154B]/10 rounded-xl text-[#4A154B]">
              <SlackIcon className="h-6 w-6" />
            </div>
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
              slackConnected
                ? 'bg-green-50 text-green-700 border-green-200/50'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              {slackConnected ? 'Active' : 'Not Connected'}
            </span>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-800">Slack Notifications</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
              Notify team support channels on Slack when complex queries need manual intervention.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[9px] text-slate-455 font-bold truncate max-w-[50%]">
            {slackConnected ? slackChannel : 'No channel configured'}
          </span>
          {slackConnected ? (
            <button
              onClick={() => setSlackConnected(false)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all text-rose-600 hover:bg-rose-50 border border-transparent cursor-pointer"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => setSlackConnected(true)}
              className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-[10px] font-bold transition-all shadow-sm cursor-pointer"
            >
              Connect Slack
            </button>
          )}
        </div>
      </div>

      {/* Integration 4: Shopify */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[210px]">
        <div>
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-[#95BF47]/10 rounded-xl text-[#95BF47]">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
              shopifyConnected
                ? 'bg-green-50 text-green-700 border-green-200/50'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              {shopifyConnected ? 'Active' : 'Not Connected'}
            </span>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-800">Shopify Order Lookup</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
              Retrieve customer order tracking, returns eligibility, and pricing logs directly for the AI model.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[9px] text-slate-455 font-bold truncate max-w-[50%]">
            {shopifyConnected ? shopifyStoreUrl : 'Shopify URL not synced'}
          </span>
          {shopifyConnected ? (
            <button
              onClick={() => setShopifyConnected(false)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all text-rose-600 hover:bg-rose-50 border border-transparent cursor-pointer"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => setShopifyConnected(true)}
              className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-[10px] font-bold transition-all shadow-sm cursor-pointer"
            >
              Connect Store
            </button>
          )}
        </div>
      </div>

      {/* Integration 5: WhatsApp Business */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[210px]">
        <div>
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-green-50 rounded-xl text-green-500">
              <Globe className="h-6 w-6" />
            </div>
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
              whatsappConnected
                ? 'bg-green-50 text-green-700 border-green-200/50'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              {whatsappConnected ? 'Active' : 'Not Connected'}
            </span>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-800">WhatsApp API Integration</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
              Connect your business phone number to field and auto-answer support messages.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[9px] text-slate-455 font-bold truncate max-w-[50%]">
            {whatsappConnected ? whatsappNumber : 'No active number'}
          </span>
          {whatsappConnected ? (
            <button
              onClick={() => setWhatsappConnected(false)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all text-rose-600 hover:bg-rose-50 border border-transparent cursor-pointer"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => setWhatsappConnected(true)}
              className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-[10px] font-bold transition-all shadow-sm cursor-pointer"
            >
              Connect API
            </button>
          )}
        </div>
      </div>

      {/* Integration 6: Zapier */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[210px]">
        <div>
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-orange-50 rounded-xl text-orange-500">
              <Link2 className="h-6 w-6" />
            </div>
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
              zapierConnected
                ? 'bg-green-50 text-green-700 border-green-200/50'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              {zapierConnected ? 'Active' : 'Not Connected'}
            </span>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-800">Zapier Automations</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
              Connect AutoReply triggers to 5000+ external tools and databases.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[9px] text-slate-455 font-bold truncate max-w-[50%]">
            {zapierConnected ? 'Zapier Webhook Enabled' : 'No Zaps connected'}
          </span>
          {zapierConnected ? (
            <button
              onClick={() => setZapierConnected(false)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all text-rose-600 hover:bg-rose-50 border border-transparent cursor-pointer"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => setZapierConnected(true)}
              className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-[10px] font-bold transition-all shadow-sm cursor-pointer"
            >
              Configure Zap
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
