export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'member';
  status: 'active' | 'invited';
}

export interface Organization {
  id: string;
  name: string;
  logo: string;
  timezone: string;
  language: string;
  aiEnabled: boolean;
  aiMode: 'Automatic' | 'Draft Only';
  model: 'GPT-5.5' | 'GPT-4.1' | 'Claude' | 'Gemini';
  prompt: string;
  temperature: number;
  maxTokens: number;
  team: TeamMember[];
}
