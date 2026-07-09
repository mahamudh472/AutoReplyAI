import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare,
  UserCheck, 
  ChevronDown, 
  Calendar,
  Bell,
  MoreVertical,
  Play,
  Bot,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon } from '../components/SocialIcons';

export const Dashboard: React.FC = () => {
  const { 
    organizations, 
    activeOrgId, 
    selectOrg,
    simulateIncomingMessage
  } = useApp();

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [customSimText, setCustomSimText] = useState('');
  const [customSimSender, setCustomSimSender] = useState('Alex');
  const [showSimPanel, setShowSimPanel] = useState(false);

  const activeOrg = organizations.find(o => o.id === activeOrgId) || organizations[0];

  const handleSimulateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSimText.trim()) return;
    simulateIncomingMessage(customSimText, customSimSender);
    setCustomSimText('');
    setShowSimPanel(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-700">
      
      {/* 1. Dashboard Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 font-outfit">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Welcome back, <span className="text-slate-800 font-semibold">Mahmudul Hasan</span> 👋</p>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Org Selector Switcher */}
          <div className="relative">
            <button
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <img src={activeOrg?.logo} alt={activeOrg?.name} className="h-4 w-4 rounded object-cover" />
              <span>{activeOrg?.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            
            {orgDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setOrgDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-40 p-1">
                  {organizations.map(org => (
                    <button
                      key={org.id}
                      onClick={() => {
                        selectOrg(org.id);
                        setOrgDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs ${org.id === activeOrgId ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <img src={org.logo} alt={org.name} className="h-4.5 w-4.5 rounded object-cover" />
                      <span className="truncate">{org.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Date Picker Selector */}
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>May 20 – May 26, 2024</span>
          </button>

          {/* Notification Bell */}
          <button className="relative p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white"></span>
          </button>
        </div>
      </div>

      {/* 2. Metrics Statistics Grid (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Messages Received */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Messages Received</p>
            <h3 className="text-2xl font-bold text-slate-800 font-outfit">142</h3>
            <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
              <span>↑ 18.5%</span> <span className="text-slate-400 font-normal">from last 7 days</span>
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <MessageSquare className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Metric 2: AI Replies Sent */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Replies Sent</p>
            <h3 className="text-2xl font-bold text-slate-800 font-outfit">118</h3>
            <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
              <span>↑ 23.1%</span> <span className="text-slate-400 font-normal">from last 7 days</span>
            </p>
          </div>
          <div className="p-3 bg-emerald-50/80 rounded-xl text-emerald-600">
            <Bot className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Metric 3: Open Conversations */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Conversations</p>
            <h3 className="text-2xl font-bold text-slate-800 font-outfit">16</h3>
            <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
              <span>↓ 5.4%</span> <span className="text-slate-400 font-normal">from last 7 days</span>
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
            <Users className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Metric 4: Human Replies */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Human Replies</p>
            <h3 className="text-2xl font-bold text-slate-800 font-outfit">24</h3>
            <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
              <span>↑ 8.7%</span> <span className="text-slate-400 font-normal">from last 7 days</span>
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <UserCheck className="h-5.5 w-5.5" />
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Recent Chats & Donut Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Conversations Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-sm font-bold text-slate-800 font-outfit">Recent Conversations</h2>
              <Link to="/conversations" className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
                View all
              </Link>
            </div>
            
            <div className="divide-y divide-slate-100">
              
              {/* Customer Row 1: John Doe */}
              <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" 
                      alt="John Doe" 
                      className="h-9 w-9 rounded-full object-cover border border-slate-100" 
                    />
                    <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
                      <FacebookIcon className="h-3 w-3 text-blue-600" />
                    </span>
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-800">John Doe</h4>
                      <span className="h-3.5 w-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px] font-bold">✓</span>
                    </div>
                    <p className="text-[11px] text-slate-450 truncate mt-0.5">Hi, I wanted to know more about your products.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-400">2m ago</span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-600 text-[9px] font-bold">
                    AI Reply
                  </span>
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                </div>
              </div>

              {/* Customer Row 2: Emily Smith */}
              <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" 
                      alt="Emily Smith" 
                      className="h-9 w-9 rounded-full object-cover border border-slate-100" 
                    />
                    <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
                      <InstagramIcon className="h-3 w-3 text-pink-500" />
                    </span>
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-800">Emily Smith</h4>
                      <span className="h-3.5 w-3.5 rounded bg-gradient-to-tr from-yellow-500 to-purple-600 flex items-center justify-center text-white text-[7px] font-bold">IG</span>
                    </div>
                    <p className="text-[11px] text-slate-450 truncate mt-0.5">Do you offer international shipping?</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-400">15m ago</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] font-bold">
                    AI Reply
                  </span>
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                </div>
              </div>

              {/* Customer Row 3: Michael Lee */}
              <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
                      alt="Michael Lee" 
                      className="h-9 w-9 rounded-full object-cover border border-slate-100" 
                    />
                    <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
                      <FacebookIcon className="h-3 w-3 text-blue-600" />
                    </span>
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-800">Michael Lee</h4>
                    <p className="text-[11px] text-slate-450 truncate mt-0.5">I need help with my order #1234</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-400">1h ago</span>
                  <span className="px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-orange-600 text-[9px] font-bold">
                    Human
                  </span>
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                </div>
              </div>

              {/* Customer Row 4: Olivia Brown */}
              <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80" 
                      alt="Olivia Brown" 
                      className="h-9 w-9 rounded-full object-cover border border-slate-100" 
                    />
                    <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
                      <InstagramIcon className="h-3 w-3 text-pink-500" />
                    </span>
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-800">Olivia Brown</h4>
                    <p className="text-[11px] text-slate-450 truncate mt-0.5">Thanks! That was helpful 😊</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-400">2h ago</span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-600 text-[9px] font-bold">
                    AI Reply
                  </span>
                  <span className="h-2 w-2 bg-transparent"></span>
                </div>
              </div>

              {/* Customer Row 5: David Wilson */}
              <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" 
                      alt="David Wilson" 
                      className="h-9 w-9 rounded-full object-cover border border-slate-100" 
                    />
                    <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
                      <FacebookIcon className="h-3 w-3 text-blue-600" />
                    </span>
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-800">David Wilson</h4>
                    <p className="text-[11px] text-slate-450 truncate mt-0.5">Is there any discount available?</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-400">3h ago</span>
                  <span className="px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-orange-600 text-[9px] font-bold">
                    Human
                  </span>
                  <span className="h-2 w-2 bg-transparent"></span>
                </div>
              </div>

            </div>
          </div>

          {/* Top Channels Donut Chart Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 font-outfit mb-6">Top Channels</h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
              {/* Donut Chart SVG */}
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg width="120" height="120" viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {/* Background Circle */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3.2" />
                  
                  {/* Messenger Path (53% - blue) */}
                  <circle 
                    cx="18" cy="18" r="15.915" 
                    fill="none" stroke="#2563eb" strokeWidth="3.2" 
                    strokeDasharray="53 47" 
                    strokeDashoffset="0" 
                  />
                  
                  {/* Instagram Path (46% - pink) */}
                  <circle 
                    cx="18" cy="18" r="15.915" 
                    fill="none" stroke="#ec4899" strokeWidth="3.2" 
                    strokeDasharray="46 54" 
                    strokeDashoffset="-53" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-slate-800">2,450</span>
                  <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Total</span>
                </div>
              </div>

              {/* Legend list */}
              <div className="space-y-3 w-full max-w-[200px]">
                <div className="flex items-center justify-between text-xs text-slate-650">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                    <span className="font-medium">Messenger</span>
                  </div>
                  <span className="font-bold text-slate-800">1,320 <span className="text-slate-400 font-normal text-[10px]">(53%)</span></span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-650">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-pink-500"></span>
                    <span className="font-medium">Instagram</span>
                  </div>
                  <span className="font-bold text-slate-800">1,130 <span className="text-slate-400 font-normal text-[10px]">(46%)</span></span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-650">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                    <span className="font-medium">Other</span>
                  </div>
                  <span className="font-bold text-slate-800">0 <span className="text-slate-400 font-normal text-[10px]">(0%)</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Connections, Status, Usage */}
        <div className="space-y-6">
          
          {/* Connection Status Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-bold text-slate-800 font-outfit">Connection Status</h3>
              <Link to="/connections" className="text-xs text-blue-600 font-semibold hover:text-blue-700">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {/* Row 1: Facebook Page */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <FacebookIcon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Facebook Page</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">ABC Store</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-250 text-emerald-600 text-[10px] font-bold">
                    Connected
                  </span>
                  <button className="p-1 text-slate-450 hover:text-slate-700">
                    <MoreVertical className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              {/* Row 2: Instagram */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-50 text-pink-600 rounded-xl">
                    <InstagramIcon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Instagram Business</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">@abc_store</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-250 text-emerald-600 text-[10px] font-bold">
                    Connected
                  </span>
                  <button className="p-1 text-slate-450 hover:text-slate-700">
                    <MoreVertical className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Status Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 font-outfit">AI Status</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] font-bold uppercase tracking-wide">
                Active
              </span>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
              <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-600">
                <Bot className="h-5 w-5" />
              </div>
              <p className="text-xs text-slate-600 leading-normal">AI is actively replying to your customers.</p>
            </div>

            <Link 
              to="/ai"
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              Go to AI Settings
            </Link>
          </div>

          {/* Usage This Month Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 font-outfit mb-5">Usage This Month</h3>
            
            <div className="flex items-center justify-between gap-4">
              {/* Radial Meter SVG */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg width="80" height="80" viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  <circle 
                    cx="18" cy="18" r="15.915" 
                    fill="none" stroke="#2563eb" strokeWidth="3" 
                    strokeDasharray="24 76" 
                    strokeDashoffset="0" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-black text-slate-850 leading-none">2,450</span>
                  <span className="text-[7px] text-slate-400 mt-0.5 leading-none">/ 10k msgs</span>
                </div>
              </div>

              {/* Legend Info */}
              <div className="space-y-3.5 flex-1">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                    <span className="font-semibold">Used</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium pl-3.5">2,450 (24%)</p>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                    <span className="font-semibold">Remaining</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium pl-3.5">7,550 (76%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Dockable Inquiry Simulator */}
      <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
        <button
          onClick={() => setShowSimPanel(!showSimPanel)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 text-xs font-bold transition-all"
        >
          <Play className="h-3 w-3 fill-slate-500 text-slate-500" />
          {showSimPanel ? 'Close Inquire Simulator' : 'Open Inquire Simulator'}
        </button>
        <span className="text-[10px] text-slate-450">Click to send test queries and review live responses.</span>
      </div>

      {showSimPanel && (
        <div className="glass-card p-5 rounded-2xl border border-blue-500/15 bg-blue-50/10 animate-fade-in space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">RAG Support Inquiry Simulator</h4>
            <div className="flex gap-2">
              <button
                onClick={() => simulateIncomingMessage("Hi! Are you open on Sunday?", "Emma")}
                className="px-2.5 py-1.5 bg-white border border-slate-250 text-slate-650 hover:bg-slate-50 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 shadow-sm"
              >
                Sunday Hours Preset
              </button>
              <button
                onClick={() => simulateIncomingMessage("Do you ship to Canada? I want some boots.", "Leo")}
                className="px-2.5 py-1.5 bg-white border border-slate-250 text-slate-650 hover:bg-slate-50 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 shadow-sm"
              >
                Shipping Preset
              </button>
            </div>
          </div>

          <form onSubmit={handleSimulateCustom} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1.5">Sender Name</label>
              <input
                type="text"
                placeholder="Sender name"
                value={customSimSender}
                onChange={(e) => setCustomSimSender(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            <div className="sm:col-span-2 flex gap-2">
              <div className="flex-1">
                <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1.5">Query Message</label>
                <input
                  type="text"
                  placeholder="What should the client say?"
                  value={customSimText}
                  onChange={(e) => setCustomSimText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 glow-primary h-9 flex-shrink-0 self-end"
              >
                <Play className="h-3 w-3 fill-white text-white" />
                Simulate
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
