export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface ProfileResponse {
  id: string;
  is_superuser: boolean;
  email: string;
  username: string | null;
  full_name: string;
  phone_number: string | null;
  avatar: string | null;
  gender: string | null;
  age: number | null;
  date_of_birth: string | null;
  joined_at: string;
  last_login: string | null;
  onboarding_completed: boolean;
  is_active: boolean;
  is_staff: boolean;
  groups: any[];
  user_permissions: any[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phoneNumber?: string | null;
  onboardingCompleted: boolean;
  notifications: {
    newMessages: boolean;
    aiReplies: boolean;
    weeklyDigest: boolean;
  };
}
