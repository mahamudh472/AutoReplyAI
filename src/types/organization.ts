export type OrganizationRole = 'owner' | 'admin' | 'member' | 'viewer';
export type InvitableOrganizationRole = Exclude<OrganizationRole, 'owner'>;

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: OrganizationRole;
  status: 'active';
  lastActive: string | null;
  createdAt: string;
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: InvitableOrganizationRole;
  status: 'invited';
  expiresAt: string;
  createdAt: string;
}

export interface TeamInviteResult {
  status: 'active' | 'invited';
  member: TeamMember | null;
  invitation: TeamInvitation | null;
  emailSent: boolean;
  message: string;
}

export interface OrganizationSubscriptionFeatures {
  max_messages: number;
  used_messages: number;
  max_team_members: number;
  used_team_members: number;
  max_connected_accounts: number;
  used_connected_accounts: number;
}

export interface OrganizationSubscription {
  plan_name: string;
  status: 'active' | 'trialing' | 'cancelled' | 'canceled' | 'past_due';
  billing_cycle?: string;
  features: OrganizationSubscriptionFeatures;
  renews_at?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  logo_url?: string | null;
  timezone: string;
  language: string;
  default_language?: string;
  description?: string;
  role?: OrganizationRole;
  members_count?: number;
  created_at?: string;
  updated_at?: string;
  aiEnabled?: boolean;
  aiMode?: 'Automatic' | 'Draft Only';
  model?: 'GPT-5.5' | 'GPT-4.1' | 'Claude' | 'Gemini';
  prompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface OrganizationListItem {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  role: OrganizationRole;
  members_count: number;
}

export interface CreateOrganizationPayload {
  name: string;
  slug?: string;
  default_language?: string;
  timezone?: string;
  description?: string;
}

export interface UpdateOrganizationPayload {
  name?: string;
  slug?: string;
  default_language?: string;
  language?: string;
  timezone?: string;
  description?: string;
}
