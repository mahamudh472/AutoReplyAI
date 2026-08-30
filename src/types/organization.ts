export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'member';
  status: 'active' | 'invited';
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
  status: 'active' | 'trial' | 'cancelled' | 'past_due';
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
  role?: 'owner' | 'member';
  created_at?: string;
  updated_at?: string;
  aiEnabled?: boolean;
  aiMode?: 'Automatic' | 'Draft Only';
  model?: 'GPT-5.5' | 'GPT-4.1' | 'Claude' | 'Gemini';
  prompt?: string;
  temperature?: number;
  maxTokens?: number;
  team?: TeamMember[];
}

export interface OrganizationListItem {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  role: 'owner' | 'member';
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
