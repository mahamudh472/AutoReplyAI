import React from 'react';
import { 
  HelpCircle, 
  Bell, 
  ChevronDown, 
  Rocket, 
  MessageSquare, 
  Sparkles, 
  Users, 
  MoreVertical, 
  Plus 
} from 'lucide-react';

export const Billing: React.FC = () => {

  const mockInvoices = [
    { id: 'INV-2024-05', date: 'May 20, 2024', amount: '$29.00', status: 'Paid' },
    { id: 'INV-2024-04', date: 'Apr 20, 2024', amount: '$29.00', status: 'Paid' },
    { id: 'INV-2024-03', date: 'Mar 20, 2024', amount: '$29.00', status: 'Paid' }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-slate-700">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-805 font-outfit">Billing</h1>
          <p className="text-xs text-slate-405 mt-1">Manage your subscription, payments, and billing information.</p>
        </div>

        {/* Header Right Widgets */}
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

      {/* 2. Sub-tabs */}
      <div className="flex items-center gap-5 border-b border-slate-200 pb-3 text-xs font-semibold flex-shrink-0">
        <button className="pb-2 text-blue-600 border-b-2 border-blue-600 font-bold">
          Overview
        </button>
        <button className="pb-2 text-slate-400 hover:text-slate-655">
          Subscription
        </button>
        <button className="pb-2 text-slate-400 hover:text-slate-655">
          Usage
        </button>
        <button className="pb-2 text-slate-400 hover:text-slate-655">
          Payment Methods
        </button>
        <button className="pb-2 text-slate-400 hover:text-slate-655">
          Invoices
        </button>
      </div>

      {/* 3. Main Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Plan and Usage (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Current Plan Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-stretch">
            
            {/* Plan Info */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-650 rounded-2xl border border-blue-100 flex-shrink-0">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800">Starter Plan</h4>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-250 text-[9px] font-bold rounded-md uppercase tracking-wider">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Billed monthly</p>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-2xl font-black text-slate-800">$29<span className="text-slate-400 text-sm font-normal"> / month</span></h3>
                </div>
              </div>

              <button className="w-full sm:w-max px-6 py-2 border border-blue-600/30 hover:bg-blue-50 text-blue-650 font-bold text-xs rounded-xl transition-colors">
                Upgrade Plan
              </button>
            </div>

            {/* Vertial divider on desktop */}
            <div className="hidden md:block w-[1px] bg-slate-150"></div>

            {/* Plan list specifications */}
            <div className="flex-1 space-y-3.5 pl-0 md:pl-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan includes:</p>
              
              <ul className="space-y-2.5 text-xs text-slate-655 font-medium">
                <li className="flex items-center gap-2 text-slate-600">
                  <span className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center text-[9px] font-bold flex-shrink-0">✓</span>
                  10,000 messages / month
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <span className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center text-[9px] font-bold flex-shrink-0">✓</span>
                  1 connected social account
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <span className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center text-[9px] font-bold flex-shrink-0">✓</span>
                  1 team member
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <span className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center text-[9px] font-bold flex-shrink-0">✓</span>
                  AI-powered replies
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <span className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center text-[9px] font-bold flex-shrink-0">✓</span>
                  Email support
                </li>
              </ul>
            </div>
          </div>

          {/* Usage this Month Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-sm font-bold text-slate-805 font-outfit">Usage this month</h3>
              <span className="text-[10px] text-slate-450 font-semibold uppercase">Resets on June 20, 2024</span>
            </div>

            {/* Meter List */}
            <div className="space-y-6">
              
              {/* Meter 1: Messages */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-650 rounded-xl flex-shrink-0">
                      <MessageSquare className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-slate-800 font-bold">Messages</h4>
                      <p className="text-[9px] text-slate-400 font-normal mt-0.5">7,550 messages remaining</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-slate-800 font-extrabold">2,450 <span className="text-slate-400 font-normal">/ 10,000</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold w-10 text-center">24%</span>
                </div>
              </div>

              {/* Meter 2: AI Replies */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-650 rounded-xl flex-shrink-0">
                      <Sparkles className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-slate-800 font-bold">AI Replies</h4>
                      <p className="text-[9px] text-slate-400 font-normal mt-0.5">8,110 AI replies remaining</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-slate-800 font-extrabold">1,890 <span className="text-slate-400 font-normal">/ 10,000</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '19%' }}></div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-bold w-10 text-center">19%</span>
                </div>
              </div>

              {/* Meter 3: Team Members */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-650 rounded-xl flex-shrink-0">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-slate-800 font-bold">Team Members</h4>
                      <p className="text-[9px] text-slate-400 font-normal mt-0.5">You've used all team member slots</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-slate-800 font-extrabold">1 <span className="text-slate-400 font-normal">/ 1</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold w-10 text-center">100%</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Summaries & Payment details (1/3 width) */}
        <div className="space-y-6">
          
          {/* Payment Summary Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-805 font-outfit">Payment Summary</h3>
            
            <div className="space-y-3.5 text-xs text-slate-500 leading-normal">
              <div className="flex justify-between items-center">
                <span>Current Plan</span>
                <span className="text-slate-800 font-semibold">Starter</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Monthly Subscription</span>
                <span className="text-slate-800 font-semibold">$29.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Next Billing Date</span>
                <span className="text-slate-805 font-bold">June 20, 2024</span>
              </div>
              
              <div className="border-t border-slate-150 pt-3.5 flex justify-between items-end">
                <span className="font-bold text-slate-700">Amount Due</span>
                <span className="text-2xl font-black text-slate-850">$29.00</span>
              </div>
            </div>

            <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 active:scale-95 transition-all">
              Update Payment Method
            </button>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-805 font-outfit">Payment Method</h3>
            
            {/* Visa Slot */}
            <div className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="px-2 py-1 bg-blue-800 text-white font-black text-[10px] rounded italic shadow-sm tracking-wide">
                  VISA
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Visa ending in 4242</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">Expires 04/27</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-250 text-emerald-600 text-[8px] font-black uppercase">
                  Default
                </span>
                <button className="p-1 text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl border border-blue-650/30 hover:bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              Add Payment Method
            </button>
          </div>

          {/* Recent Invoices Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 font-outfit">Recent Invoices</h3>
              <a href="#" className="text-xs text-blue-600 font-semibold hover:underline">
                View all
              </a>
            </div>

            <div className="divide-y divide-slate-100 text-xs font-medium">
              {mockInvoices.map(inv => (
                <div key={inv.id} className="flex justify-between items-center py-2.5">
                  <div>
                    <p className="text-slate-800 font-bold">{inv.date}</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase">{inv.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800">{inv.amount}</span>
                    <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-250 text-emerald-600 text-[9px] font-bold rounded">
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
