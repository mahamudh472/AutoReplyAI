import React, { useState } from 'react';
import { Check, CheckCircle } from 'lucide-react';
import { SlackIcon } from '../SocialIcons';

export const NotificationsTab: React.FC = () => {
  // Email Notification Toggles
  const [productUpdates, setProductUpdates] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [tipsBestPractices, setTipsBestPractices] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Custom states
  const [pushNotifications, setPushNotifications] = useState(false);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [notifyIncoming, setNotifyIncoming] = useState(true);
  const [notifyDraftReady, setNotifyDraftReady] = useState(true);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 2000);
  };

  const handleTogglePush = (checked: boolean) => {
    if (checked) {
      if ('Notification' in window) {
        setPushNotifications(true);
      } else {
        alert('Push notifications not supported on this browser');
      }
    } else {
      setPushNotifications(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Left Column (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Email Preferences Card */}
        <form onSubmit={handleSaveNotifications} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit font-medium">Email Preferences</h3>
            <p className="text-xs text-slate-400 mt-0.5">Control which email digests and alerts you want to receive.</p>
          </div>

          <div className="space-y-4">
            {/* Option 1: Product updates */}
            <div className="flex items-start justify-between">
              <div className="max-w-[80%]">
                <h4 className="text-xs font-bold text-slate-885 leading-normal">Product updates</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Stay informed about new features, enhancements, and product releases.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                <input
                  type="checkbox"
                  checked={productUpdates}
                  onChange={(e) => setProductUpdates(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Option 2: Weekly summary */}
            <div className="flex items-start justify-between">
              <div className="max-w-[80%]">
                <h4 className="text-xs font-bold text-slate-885 leading-normal">Weekly summary</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Receive a comprehensive report of incoming inquiries and AI reply efficiency.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                <input
                  type="checkbox"
                  checked={weeklySummary}
                  onChange={(e) => setWeeklySummary(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Option 3: Tips and best practices */}
            <div className="flex items-start justify-between">
              <div className="max-w-[80%]">
                <h4 className="text-xs font-bold text-slate-885 leading-normal">Tips and best practices</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Get tutorials, optimization tips, and articles about setting up knowledge base contexts.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                <input
                  type="checkbox"
                  checked={tipsBestPractices}
                  onChange={(e) => setTipsBestPractices(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Option 4: Marketing emails */}
            <div className="flex items-start justify-between">
              <div className="max-w-[80%]">
                <h4 className="text-xs font-bold text-slate-885 leading-normal">Marketing emails</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Get occasional offers, discount alerts, and partner deal recommendations.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                <input
                  type="checkbox"
                  checked={marketingEmails}
                  onChange={(e) => setMarketingEmails(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Save Button Row */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-500/10 text-xs flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              {showNotificationToast ? (
                <>
                  <Check className="h-4 w-4" />
                  Preferences Saved
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </form>

        {/* System Events Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit">System Events Alert</h3>
            <p className="text-xs text-slate-400 mt-0.5">Toggle fine-grained real-time alerts for system actions.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-800">New customer query received</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Get notified immediately when a customer starts a new chat thread.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyIncoming}
                  onChange={(e) => setNotifyIncoming(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">AI auto-reply draft generated</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">For Draft Only mode: ping the dashboard when a new draft is ready for approval.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyDraftReady}
                  onChange={(e) => setNotifyDraftReady(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column (1/3 width) */}
      <div className="space-y-6">
        
        {/* Browser Push Notifications Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit font-medium">Push Notifications</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Get alert sound and desktop badges in your browser.</p>
          </div>

          <div className="flex items-start justify-between pt-2">
            <div className="max-w-[75%]">
              <h4 className="text-xs font-bold text-slate-800">Enable in Browser</h4>
              <p className="text-[9px] text-slate-455 mt-0.5">Send alerts even when the dashboard tab is running in the background.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => handleTogglePush(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {pushNotifications && (
            <div className="p-3 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-xl border border-blue-200/40 flex items-center gap-2 animate-fade-in">
              <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span>Browser notifications successfully initialized!</span>
            </div>
          )}
        </div>

        {/* Slack integration alerts */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <SlackIcon className="h-5 w-5 text-[#4A154B]" />
            <div>
              <h3 className="text-sm font-bold text-slate-855 font-outfit">Slack Alerts</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Notify your support channels.</p>
            </div>
          </div>

          <div className="flex items-start justify-between pt-2">
            <div className="max-w-[75%]">
              <h4 className="text-xs font-bold text-slate-800">Forward alerts to Slack</h4>
              <p className="text-[9px] text-slate-455 mt-0.5">Route error notices or active drafts directly to Slack.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={slackAlerts}
                onChange={(e) => setSlackAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <p className="text-[9px] text-slate-400 leading-relaxed bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            Setup Slack workspace connection under the <strong>Integrations</strong> tab to configure webhook target channels.
          </p>
        </div>

      </div>
    </div>
  );
};
