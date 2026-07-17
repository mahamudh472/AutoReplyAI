import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Check if this window received a redirect query parameter from Meta callback
const params = new URLSearchParams(window.location.search);
const isSuccess = params.get('success') === 'true' || window.location.hash.includes('success=true');
const errorMsg = params.get('error') || (window.location.hash.match(/error=([^&]+)/) || [])[1];

if (isSuccess || errorMsg) {
  // 1. Try BroadcastChannel
  try {
    const channel = new BroadcastChannel('meta_auth_channel');
    if (isSuccess) {
      channel.postMessage({ type: 'FB_AUTH_SUCCESS' });
    } else {
      channel.postMessage({ type: 'FB_AUTH_CANCEL', error: errorMsg ? decodeURIComponent(errorMsg) : '' });
    }
    channel.close();
  } catch (e) {
    console.warn('BroadcastChannel failed:', e);
  }

  // 2. Try window.opener fallback
  if (window.opener) {
    try {
      if (isSuccess) {
        window.opener.postMessage({ type: 'FB_AUTH_SUCCESS' }, '*');
      } else {
        window.opener.postMessage({ type: 'FB_AUTH_CANCEL', error: errorMsg ? decodeURIComponent(errorMsg) : '' }, '*');
      }
    } catch (e) {
      console.error('window.opener.postMessage failed:', e);
    }
  }

  // 3. Close the popup
  try {
    window.close();
  } catch (e) {
    console.error('window.close failed:', e);
  }
}

// Layout
import { MainLayout } from './components/MainLayout';

// Pages
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Conversations } from './pages/Conversations';
import { Connections } from './pages/Connections';
import { AISettings } from './pages/AISettings';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Organization } from './pages/Organization';
import { Team } from './pages/Team';
import { Billing } from './pages/Billing';
import { Profile } from './pages/Profile';
import { MockFacebookOAuth } from './pages/MockFacebookOAuth';

import './App.css';

const AppContent: React.FC = () => {
  const { user } = useApp();

  // 1. Unauthenticated view
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/mock-facebook-oauth" element={<MockFacebookOAuth />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    );
  }

  // 2. Authenticated but onboarding not completed
  if (!user.onboardingCompleted) {
    return (
      <Router>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/mock-facebook-oauth" element={<MockFacebookOAuth />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
      </Router>
    );
  }

  // 3. Authenticated and Onboarded: Show Main layout & Navigation
  return (
    <Router>
      <Routes>
        <Route path="/mock-facebook-oauth" element={<MockFacebookOAuth />} />
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/conversations" element={<Conversations />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/ai" element={<AISettings />} />
              <Route path="/knowledge" element={<KnowledgeBase />} />
              <Route path="/team" element={<Team />} />
              <Route path="/organization" element={<Organization />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
