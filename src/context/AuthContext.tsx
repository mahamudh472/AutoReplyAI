import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ProfileResponse, User } from '../types/auth';
import { api, getAccessToken, getRefreshToken, setTokens, clearTokens } from '../services';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (email: string, name: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapProfileToUser = (profile: ProfileResponse): User => ({
  id: profile.id,
  name: profile.full_name || 'No Name',
  email: profile.email,
  avatar:
    profile.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  phoneNumber: profile.phone_number,
  onboardingCompleted: profile.onboarding_completed,
  notifications: { newMessages: true, aiReplies: true, weeklyDigest: false },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('replyai_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('replyai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('replyai_user');
    }
  }, [user]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    if (!password) {
      throw new Error('Password is required');
    }
    const tokenData = await api.login(email, password);
    setTokens(tokenData.access, tokenData.refresh);
    const profile = await api.getProfile();
    setUser(mapProfileToUser(profile));
    return true;
  };

  const signup = async (email: string, name: string, password?: string): Promise<boolean> => {
    if (!password) {
      throw new Error('Password is required');
    }
    await api.register(email, password, name);
    return true;
  };

  const logout = async () => {
    const refresh = getRefreshToken();
    if (refresh) {
      try {
        await api.logout(refresh);
      } catch (err) {
        console.warn('Backend logout failed', err);
      }
    }
    clearTokens();
    setUser(null);
    localStorage.removeItem('replyai_user');
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    const patchData: Partial<ProfileResponse> = {};
    if (updates.name !== undefined) patchData.full_name = updates.name;
    if (updates.email !== undefined) patchData.email = updates.email;
    if (updates.avatar !== undefined) patchData.avatar = updates.avatar;
    if (updates.phoneNumber !== undefined) patchData.phone_number = updates.phoneNumber;
    if (updates.onboardingCompleted !== undefined) {
      patchData.onboarding_completed = updates.onboardingCompleted;
    }

    if (Object.keys(patchData).length > 0) {
      const updatedProfile = await api.updateProfile(patchData);
      setUser((previous) => ({
        ...mapProfileToUser(updatedProfile),
        notifications: updates.notifications || previous?.notifications || {
          newMessages: true,
          aiReplies: true,
          weeklyDigest: false,
        },
      }));
      return;
    }

    setUser((previous) => (previous ? { ...previous, ...updates } : null));
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      if (user) {
        logout();
      }
      return;
    }

    api.getProfile()
      .then((profile) => {
        setUser(mapProfileToUser(profile));
      })
      .catch((err) => {
        console.error('Failed to load user profile from backend on mount', err);
        logout();
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
