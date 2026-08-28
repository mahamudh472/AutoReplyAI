export interface Connection {
  platform: 'facebook' | 'instagram';
  connected: boolean;
  pageName?: string;
  pageId?: string;
  lastSync?: string;
  webhookStatus?: 'active' | 'inactive';
}

export interface MetaPage {
  id: string;
  name: string;
}

export interface MetaAuthResponse {
  authorization_url: string;
}
