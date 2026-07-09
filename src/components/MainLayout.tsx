import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Share2, 
  Sparkles, 
  Database, 
  Users,
  Settings,
  Menu, 
  X, 
  ChevronDown, 
  BarChart2,
  Bot,
  Building2,
  CreditCard
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { 
    user, 
    logout, 
    conversations,
  } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Calculate unread count
  const unreadCount = conversations.filter(c => c.unread && c.status === 'open').length;

  const navigation: SidebarItem[] = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Conversations', path: '/conversations', icon: MessageSquare, badge: unreadCount || 12 },
    { name: 'Connections', path: '/connections', icon: Share2 },
    { name: 'AI Settings', path: '/ai', icon: Sparkles },
    { name: 'Knowledge Base', path: '/knowledge', icon: Database },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Organization', path: '/organization', icon: Building2 },
    { name: 'Billing', path: '/billing', icon: CreditCard },
    { name: 'Settings', path: '/profile', icon: Settings }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 text-slate-600 select-none">
      
      {/* Sidebar Header / Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/10">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 font-outfit">
            AutoReply <span className="text-blue-600">AI</span>
          </span>
        </div>
        {mobileOpen && (
          <button onClick={() => setMobileOpen(false)} className="md:hidden p-1 text-slate-400 hover:text-slate-600">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isActive ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Plan Progress Block Widget */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 m-4 rounded-2xl border border-slate-200/50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Plan</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">Starter</p>
          </div>
          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
            <BarChart2 className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
            <span>Messages / month</span>
            <span className="text-slate-700 font-semibold">2,450 / 10,000</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '24%' }}></div>
          </div>
          <p className="text-[10px] text-slate-400 text-right">24%</p>
        </div>

        <button className="w-full mt-3 py-2 rounded-xl border border-blue-600/30 hover:bg-blue-50 text-blue-600 font-semibold text-xs transition-colors">
          Upgrade Plan
        </button>
      </div>

      {/* User profile / Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/40 relative">
        <div 
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="flex items-center justify-between cursor-pointer p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
              alt={user?.name} 
              className="h-8.5 w-8.5 rounded-full object-cover border border-slate-200 flex-shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate leading-none">Mahmudul Hasan</p>
              <p className="text-[10px] text-slate-400 truncate mt-1">Owner</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
        </div>

        {/* Profile Dropdown */}
        {profileDropdownOpen && (
          <>
            <div className="fixed inset-0 z-35" onClick={() => setProfileDropdownOpen(false)}></div>
            <div className="absolute bottom-16 left-4 right-4 bg-white border border-slate-200 rounded-xl shadow-lg z-45 p-1.5 animate-fade-in">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs text-red-600 hover:bg-red-50 font-semibold transition-colors"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Bot className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-md font-bold tracking-tight text-slate-800 font-outfit">AutoReply AI</span>
        </div>
        
        <button 
          onClick={() => setMobileOpen(true)}
          className="p-1.5 text-slate-500 hover:text-slate-850 hover:bg-slate-50 rounded-lg"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden flex animate-fade-in">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)}></div>
          <div className="relative w-64 h-full z-10 animate-slide-in">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col md:pl-64 pt-16 md:pt-0 min-h-screen relative">
        <div className="flex-1 p-6 md:p-8 z-10 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
