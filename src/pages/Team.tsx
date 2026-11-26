import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  CheckCircle,
  ChevronDown,
  Crown,
  Eye,
  Loader2,
  Plus,
  Search,
  Send,
  Shield,
  Trash2,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { InvitableOrganizationRole, OrganizationRole } from '../types/organization';

interface TeamRow {
  key: string;
  id: string;
  name: string;
  email: string;
  role: OrganizationRole;
  status: 'active' | 'invited';
  lastActive: string | null;
  expiresAt?: string;
  isYou: boolean;
  kind: 'member' | 'invitation';
}

const roleBadgeClass = (role: OrganizationRole): string => {
  switch (role) {
    case 'owner':
      return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'admin':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'viewer':
      return 'bg-orange-50 text-orange-600 border-orange-200';
    default:
      return 'bg-slate-100 text-slate-500 border-slate-200';
  }
};

const formatDate = (value: string | null): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export const Team: React.FC = () => {
  const {
    user,
    organizations,
    activeOrg,
    activeOrgId,
    orgSubscription,
    teamMembers,
    teamInvitations,
    isTeamLoading,
    isTeamSaving,
    teamError,
    selectOrg,
    inviteTeamMember,
    updateTeamMemberRole,
    removeTeamMember,
    cancelTeamInvitation,
    resendTeamInvitation,
  } = useApp();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<InvitableOrganizationRole>('member');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const canManage = activeOrg?.role === 'owner' || activeOrg?.role === 'admin';
  const rows: TeamRow[] = [
    ...teamMembers.map((member) => ({
      key: `member-${member.id}`,
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status,
      lastActive: member.lastActive,
      isYou: member.userId === user?.id,
      kind: 'member' as const,
    })),
    ...teamInvitations.map((invitation) => ({
      key: `invitation-${invitation.id}`,
      id: invitation.id,
      name: invitation.email.split('@')[0],
      email: invitation.email,
      role: invitation.role as OrganizationRole,
      status: invitation.status,
      lastActive: null,
      expiresAt: invitation.expiresAt,
      isYou: false,
      kind: 'invitation' as const,
    })),
  ];

  const filteredRows = rows.filter((row) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || row.name.toLowerCase().includes(query) || row.email.toLowerCase().includes(query);
    const matchesRole = roleFilter === 'all' || row.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const runAction = async (action: () => Promise<unknown>, message?: string) => {
    setActionError('');
    setSuccessMessage('');
    try {
      await action();
      if (message) setSuccessMessage(message);
    } catch (error: any) {
      setActionError(error?.error || error?.detail || error?.message || 'The team action failed.');
    }
  };

  const handleInviteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!inviteEmail.trim()) return;

    setActionError('');
    setSuccessMessage('');
    try {
      const result = await inviteTeamMember(inviteEmail.trim(), inviteRole);
      setInviteEmail('');
      setInviteRole('member');
      setSuccessMessage(
        `${result.message}${result.emailSent ? '' : ' No email was sent because SMTP is not configured or unavailable.'}`
      );
    } catch (error: any) {
      setActionError(error?.error || error?.detail || error?.message || 'Failed to invite this member.');
    }
  };

  if (!activeOrg) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-4">
        <Building2 className="h-10 w-10 text-slate-300 mx-auto" />
        <div>
          <h1 className="text-lg font-bold text-slate-800">No organization selected</h1>
          <p className="text-xs text-slate-400 mt-1">Create or select an organization before managing its team.</p>
        </div>
        <Link to="/organization" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Open Organization Settings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 font-outfit">Team</h1>
          <p className="text-xs text-slate-400 mt-1">Manage real members and pending invitations for this organization.</p>
        </div>

        <div className="relative">
          <select
            value={activeOrgId || ''}
            onChange={(event) => selectOrg(event.target.value)}
            className="appearance-none pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:border-blue-500"
            aria-label="Select organization"
          >
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>{organization.name}</option>
            ))}
          </select>
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 pointer-events-none" />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {(actionError || teamError) && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{actionError || teamError}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-medium">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-outfit">
                Team Members & Invitations ({rows.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {teamMembers.length} active · {teamInvitations.length} pending invitation{teamInvitations.length === 1 ? '' : 's'}
              </p>
            </div>
            {canManage && (
              <button
                type="button"
                onClick={() => document.getElementById('invite-email')?.focus()}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> Invite Member
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 bg-slate-50/30 font-bold">
                    <th className="p-4 uppercase tracking-wider text-[10px]">Member</th>
                    <th className="p-4 uppercase tracking-wider text-[10px]">Role</th>
                    <th className="p-4 uppercase tracking-wider text-[10px]">Status</th>
                    <th className="p-4 uppercase tracking-wider text-[10px]">Activity / Expiry</th>
                    {canManage && <th className="p-4 uppercase tracking-wider text-[10px]">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {isTeamLoading ? (
                    <tr><td colSpan={canManage ? 5 : 4} className="p-10 text-center"><Loader2 className="h-5 w-5 animate-spin text-blue-600 mx-auto" /></td></tr>
                  ) : filteredRows.length === 0 ? (
                    <tr><td colSpan={canManage ? 5 : 4} className="p-10 text-center text-slate-400">No team entries match this view.</td></tr>
                  ) : filteredRows.map((row) => (
                    <tr key={row.key} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8.5 w-8.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                            {row.name.charAt(0)}
                          </div>
                          <div className="truncate max-w-[190px]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 truncate block leading-tight">{row.name}</span>
                              {row.isYou && <span className="px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-600 text-[8px] font-black uppercase">You</span>}
                            </div>
                            <span className="text-[10px] text-slate-400 truncate mt-0.5 block">{row.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {canManage && row.kind === 'member' && row.role !== 'owner' ? (
                          <select
                            value={row.role}
                            disabled={isTeamSaving}
                            onChange={(event) => runAction(
                              () => updateTeamMemberRole(row.id, event.target.value as InvitableOrganizationRole),
                              `Role updated for ${row.email}.`
                            )}
                            className="px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-[10px] font-bold uppercase focus:outline-none focus:border-blue-500"
                          >
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-0.5 rounded border text-[9px] font-bold uppercase ${roleBadgeClass(row.role)}`}>{row.role}</span>
                        )}
                      </td>
                      <td className="p-4">
                        {row.status === 'active' ? (
                          <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center gap-1.5 w-max">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-bold flex items-center gap-1.5 w-max">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span> Invited
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-400 font-semibold text-[10px]">
                        {row.kind === 'invitation' ? `Expires ${formatDate(row.expiresAt || null)}` : formatDate(row.lastActive)}
                      </td>
                      {canManage && (
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {row.kind === 'invitation' && (
                              <button
                                disabled={isTeamSaving}
                                onClick={async () => {
                                  setActionError('');
                                  setSuccessMessage('');
                                  try {
                                    const result = await resendTeamInvitation(row.id);
                                    setSuccessMessage(`${result.message}${result.emailSent ? '' : ' SMTP is not configured or unavailable.'}`);
                                  } catch (error: any) {
                                    setActionError(error?.error || error?.message || 'Failed to resend invitation.');
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-700 text-[10px] font-bold hover:underline disabled:opacity-50"
                              >
                                Resend
                              </button>
                            )}
                            {row.role !== 'owner' && (
                              <button
                                disabled={isTeamSaving}
                                onClick={() => {
                                  const message = row.kind === 'member'
                                    ? `Remove ${row.email} from this organization?`
                                    : `Cancel the invitation for ${row.email}?`;
                                  if (!window.confirm(message)) return;
                                  runAction(
                                    () => row.kind === 'member' ? removeTeamMember(row.id) : cancelTeamInvitation(row.id),
                                    row.kind === 'member' ? 'Member removed.' : 'Invitation cancelled.'
                                  );
                                }}
                                className="p-1 hover:text-rose-600 text-slate-400 rounded transition-all disabled:opacity-50"
                                title={row.kind === 'member' ? 'Remove member' : 'Cancel invitation'}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-slate-50/20 border-t border-slate-100 text-xs text-slate-400 font-medium">
              Showing {filteredRows.length} of {rows.length} team entries
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {canManage && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-outfit">Invite New Member</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Registered users are added immediately. New users join automatically after verifying this email.
                </p>
              </div>
              {orgSubscription && (
                <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 flex justify-between">
                  <span>Seats used (including pending)</span>
                  <strong className="text-slate-700">
                    {orgSubscription.features.used_team_members} / {orgSubscription.features.max_team_members}
                  </strong>
                </div>
              )}
              <form onSubmit={handleInviteSubmit} className="space-y-3.5">
                <input
                  id="invite-email"
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
                  required
                />
                <select
                  value={inviteRole}
                  onChange={(event) => setInviteRole(event.target.value as InvitableOrganizationRole)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-650 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  type="submit"
                  disabled={isTeamSaving}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 disabled:opacity-60"
                >
                  {isTeamSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3 w-3" />}
                  {isTeamSaving ? 'Processing...' : 'Send Invitation'}
                </button>
              </form>
            </div>
          )}

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-outfit">Roles & Permissions</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Roles are validated by the backend on every change.</p>
            </div>
            <div className="space-y-4">
              {[
                { role: 'Owner', icon: Crown, color: 'bg-purple-50 text-purple-600 border-purple-100', description: 'Full access, including organization deletion.' },
                { role: 'Admin', icon: Shield, color: 'bg-blue-50 text-blue-600 border-blue-100', description: 'Manage team, organization settings, and billing.' },
                { role: 'Member', icon: User, color: 'bg-slate-50 text-slate-500 border-slate-200', description: 'Access conversations and organization features.' },
                { role: 'Viewer', icon: Eye, color: 'bg-orange-50 text-orange-600 border-orange-100', description: 'Read-only access to conversations and reports.' },
              ].map(({ role, icon: Icon, color, description }) => (
                <div key={role} className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl flex-shrink-0 border ${color}`}><Icon className="h-4.5 w-4.5" /></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">{role}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/organization" className="text-blue-600 text-xs font-bold flex items-center gap-1.5 hover:text-blue-700">
              Organization settings <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
