import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trash2, 
  Plus, 
  HelpCircle, 
  Bell, 
  ChevronDown,
  MoreVertical,
  Shield,
  Eye,
  User,
  Crown,
  Send,
  ArrowUpRight,
  Search
} from 'lucide-react';

export const Team: React.FC = () => {
  const { organizations, activeOrgId, inviteTeamMember, removeTeamMember } = useApp();

  const org = organizations.find(o => o.id === activeOrgId) || organizations[0];
  
  // Local Form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'owner' | 'admin' | 'member' | 'viewer'>('member');
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    // Auto-extract name preview from email prefix
    const namePart = inviteName.trim() || inviteEmail.split('@')[0];
    
    // Call invite action
    inviteTeamMember(inviteEmail, namePart, inviteRole as any);
    setInviteEmail('');
    setInviteName('');
    setInviteRole('member');
  };

  // Roles formatting
  const getRoleBadgeClass = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return 'bg-purple-50 text-purple-650 border-purple-200';
      case 'admin':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'viewer':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      default: // member
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  // Mock initial users list to match mockup rows perfectly
  // Nusrat Jahan (Admin), Rashed Hossain (Member), Sadia Islam (Member), Emon Ahmed (Viewer - Invited)
  const defaultMembers = [
    { id: '1', name: 'Mahmudul Hasan', email: 'mahmudul@example.com', role: 'owner', status: 'active', lastActive: 'Today, 10:30 AM', isYou: true },
    { id: '2', name: 'Nusrat Jahan', email: 'nusrat@example.com', role: 'admin', status: 'active', lastActive: 'Today, 09:15 AM', isYou: false },
    { id: '3', name: 'Rashed Hossain', email: 'rashed@example.com', role: 'member', status: 'active', lastActive: 'Yesterday, 08:45 PM', isYou: false },
    { id: '4', name: 'Sadia Islam', email: 'sadia@example.com', role: 'member', status: 'active', lastActive: 'May 19, 2024 04:20 PM', isYou: false },
    { id: '5', name: 'Emon Ahmed', email: 'emon@example.com', role: 'viewer', status: 'invited', lastActive: '—', isYou: false }
  ];

  // Merge default members with any dynamically invited members in context
  const dynamicMembers = org.team.filter(m => !defaultMembers.some(dm => dm.email.toLowerCase() === m.email.toLowerCase()));
  const allMembers = [
    ...defaultMembers,
    ...dynamicMembers.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role,
      status: m.status,
      lastActive: m.status === 'invited' ? '—' : 'Just Now',
      isYou: false
    }))
  ];

  // Filter list
  const filteredMembers = allMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
      m.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || m.role.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in text-slate-705">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-805 font-outfit">Team</h1>
          <p className="text-xs text-slate-405 mt-1">Manage your team members and their access to AutoReply AI.</p>
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

      {/* 2. Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Team Table (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Table Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-805 font-outfit">Team Members ({allMembers.length})</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage who has access to your organization.</p>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  const emailInput = document.getElementById('invite-email');
                  emailInput?.focus();
                }}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 transition-all active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                Invite Member
              </button>
            </div>

            {/* Filters Row */}
            <div className="flex gap-2">
              <div className="relative max-w-xs flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
              >
                <option value="all">All Roles</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            {/* Members Library Table Grid */}
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 bg-slate-50/10 font-bold">
                      <th className="p-4 uppercase tracking-wider text-[10px]">Member</th>
                      <th className="p-4 uppercase tracking-wider text-[10px]">Role</th>
                      <th className="p-4 uppercase tracking-wider text-[10px]">Status</th>
                      <th className="p-4 uppercase tracking-wider text-[10px]">Last Active</th>
                      <th className="p-4 uppercase tracking-wider text-[10px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-655 font-medium">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="h-8.5 w-8.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                            {member.name.charAt(0)}
                          </div>
                          <div className="truncate max-w-[200px]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 truncate block leading-tight">{member.name}</span>
                              {member.isYou && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-650 text-[8px] font-black uppercase">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 truncate mt-0.5 block">{member.email}</span>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded border text-[9px] font-bold uppercase ${getRoleBadgeClass(member.role)}`}>
                            {member.role}
                          </span>
                        </td>
                        
                        <td className="p-4">
                          {member.status === 'active' ? (
                            <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center gap-1.5 w-max">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-bold flex items-center gap-1.5 w-max">
                              <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                              Invited
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-slate-450 font-semibold">
                          {member.lastActive}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {member.status === 'invited' && (
                              <button 
                                onClick={() => {
                                  inviteTeamMember(member.email, member.name, member.role as any);
                                  alert(`Invitation resent to ${member.email}`);
                                }}
                                className="text-blue-600 hover:text-blue-700 text-[10px] font-bold mr-1 hover:underline"
                              >
                                Resend
                              </button>
                            )}

                            {member.isYou ? (
                              <span className="text-slate-300 font-normal">—</span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => removeTeamMember(member.id)}
                                  className="p-1 hover:text-rose-600 text-slate-400 rounded transition-all"
                                  title="Remove Member"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <button className="p-1 text-slate-400 hover:text-slate-655 rounded">
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-6 py-3 bg-slate-50/20 border-t border-slate-100 text-xs text-slate-450 font-medium">
                Showing 1 to {filteredMembers.length} of {filteredMembers.length} members
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Invite Form & Roles Summary (1/3 width) */}
        <div className="space-y-6">
          
          {/* Invite New Member Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-805 font-outfit">Invite New Member</h3>
              <p className="text-[10px] text-slate-450 mt-0.5">Add new members to your organization and choose their role.</p>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5">
              <div>
                <input
                  id="invite-email"
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Full Name (Optional)"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <div>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-650 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              <div className="text-[10px] text-blue-600 font-bold flex items-center gap-1 hover:underline cursor-pointer select-none">
                <HelpCircle className="h-3.5 w-3.5" />
                Learn about roles
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all"
              >
                <Send className="h-3 w-3 fill-white text-white rotate-45 -translate-y-0.5 translate-x-0.5" />
                Send Invitation
              </button>
            </form>
          </div>

          {/* Roles & Permissions Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-805 font-outfit">Roles & Permissions</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Choose a role to see what permissions are included.</p>
            </div>

            <div className="space-y-4">
              
              {/* Role 1: Owner */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl flex-shrink-0 border border-purple-100">
                  <Crown className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">Owner</h4>
                  <p className="text-[10px] text-slate-450 mt-1 leading-normal">Full access to all features and settings.</p>
                </div>
              </div>

              {/* Role 2: Admin */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0 border border-blue-100">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">Admin</h4>
                  <p className="text-[10px] text-slate-450 mt-1 leading-normal">Manage team, settings, and billing.</p>
                </div>
              </div>

              {/* Role 3: Member */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 text-slate-500 rounded-xl flex-shrink-0 border border-slate-200">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">Member</h4>
                  <p className="text-[10px] text-slate-450 mt-1 leading-normal">Access conversations and most features.</p>
                </div>
              </div>

              {/* Role 4: Viewer */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl flex-shrink-0 border border-orange-100">
                  <Eye className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight">Viewer</h4>
                  <p className="text-[10px] text-slate-450 mt-1 leading-normal">View conversations and reports.</p>
                </div>
              </div>

            </div>

            <button className="text-blue-600 text-xs font-bold flex items-center gap-1.5 hover:text-blue-700">
              Learn more about roles <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
