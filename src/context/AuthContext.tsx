import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/auth';
import { api, getAccessToken, getRefreshToken, setTokens, clearTokens } from '../services';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (email: string, name: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    const hasOnboarded = localStorage.getItem(`replyai_onboarded_${email}`) === 'true';

    setUser({
      id: profile.id,
      name: profile.full_name || 'No Name',
      email: profile.email,
      avatar:
        profile.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      phoneNumber: profile.phone_number,
      onboardingCompleted: hasOnboarded,
      notifications: { newMessages: true, aiReplies: true, weeklyDigest: false },
    });
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

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };

      if (updates.onboardingCompleted !== undefined) {
        localStorage.setItem(`replyai_onboarded_${prev.email}`, String(updates.onboardingCompleted));
      }

      if (updates.name !== undefined || updates.avatar !== undefined || updates.phoneNumber !== undefined) {
        const patchData: any = {};
        if (updates.name !== undefined) patchData.full_name = updates.name;
        if (updates.avatar !== undefined) patchData.avatar = updates.avatar;
        if (updates.phoneNumber !== undefined) patchData.phone_number = updates.phoneNumber;

        api.updateProfile(patchData)
          .then((updatedProfile) => {
            console.log('Profile successfully updated on backend', updatedProfile);
          })
          .catch((err) => {
            console.error('Failed to update profile on backend', err);
          });
      }

      return updated;
    });
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
        const email = profile.email;
        const hasOnboarded = localStorage.getItem(`replyai_onboarded_${email}`) === 'true';

        setUser({
          id: profile.id,
          name: profile.full_name || 'No Name',
          email: profile.email,
          avatar:
            profile.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          phoneNumber: profile.phone_number,
          onboardingCompleted: hasOnboarded,
          notifications: { newMessages: true, aiReplies: true, weeklyDigest: false },
        });
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
