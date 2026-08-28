import React from 'react';

interface AvailableConnectionsDeckProps {
  hasMetaConnected: boolean;
  onOpenMetaModal: () => void;
}

export const AvailableConnectionsDeck: React.FC<AvailableConnectionsDeckProps> = ({
  hasMetaConnected,
  onOpenMetaModal,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-805 font-outfit">Available Connections</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Connect more platforms to manage all your messages in one place
        </p>
      </div>

      {/* Card Deck Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {/* Card 1: Meta Facebook Page */}
        <div className="p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-slate-305 transition-colors">
          <div>
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                ∞
              </div>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                  hasMetaConnected
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                {hasMetaConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-800 mt-4">Meta</h4>
            <p className="text-[11px] text-slate-450 mt-1.5 leading-normal">
              Connect Facebook Pages, Instagram Business accounts and Messenger.
            </p>
          </div>

          <button
            onClick={onOpenMetaModal}
            className="w-full mt-6 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {hasMetaConnected ? 'Manage' : 'Connect'}
          </button>
        </div>

        {/* Card 2: WhatsApp Business */}
        <div className="p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-slate-305 transition-colors">
          <div>
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg font-bold">
                ☏
              </div>
              <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wide">
                Coming Soon
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-800 mt-4">WhatsApp Business</h4>
            <p className="text-[11px] text-slate-450 mt-1.5 leading-normal">
              Connect your WhatsApp Business account to automate replies.
            </p>
          </div>

          <button className="w-full mt-6 py-2 border border-blue-600/30 hover:bg-blue-50 text-blue-600 font-semibold text-xs rounded-xl transition-colors cursor-pointer">
            Notify me
          </button>
        </div>

        {/* Card 3: Telegram Channels */}
        <div className="p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-slate-305 transition-colors">
          <div>
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center text-lg font-bold">
                ✈
              </div>
              <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wide">
                Coming Soon
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-800 mt-4">Telegram</h4>
            <p className="text-[11px] text-slate-450 mt-1.5 leading-normal">
              Connect your Telegram account to manage messages.
            </p>
          </div>

          <button className="w-full mt-6 py-2 border border-blue-600/30 hover:bg-blue-50 text-blue-600 font-semibold text-xs rounded-xl transition-colors cursor-pointer">
            Notify me
          </button>
        </div>

        {/* Card 4: TikTok Business */}
        <div className="p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-slate-305 transition-colors">
          <div>
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center text-md font-bold">
                ♪
              </div>
              <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wide">
                Coming Soon
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-805 mt-4">TikTok</h4>
            <p className="text-[11px] text-slate-450 mt-1.5 leading-normal">
              Connect your TikTok Business account to manage messages.
            </p>
          </div>

          <button className="w-full mt-6 py-2 border border-blue-600/30 hover:bg-blue-50 text-blue-600 font-semibold text-xs rounded-xl transition-colors cursor-pointer">
            Notify me
          </button>
        </div>

        {/* Nav Right Slider circle button */}
        <button className="absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10 cursor-pointer">
          &gt;
        </button>
      </div>
    </div>
  );
};
