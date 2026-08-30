import { authService } from './authService';
import { profileService } from './profileService';
import { aiSettingsService } from './aiSettingsService';
import { knowledgeBaseService } from './knowledgeBaseService';
import { metaService } from './metaService';
import { organizationService } from './organizationService';

export * from './tokenService';
export * from './apiClient';
export * from './authService';
export * from './profileService';
export * from './aiSettingsService';
export * from './knowledgeBaseService';
export * from './metaService';
export * from './organizationService';

export const api = {
  ...authService,
  ...profileService,
  ...aiSettingsService,
  ...knowledgeBaseService,
  ...metaService,
  ...organizationService,
};
