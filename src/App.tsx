import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

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

import './App.css';

const AppContent: React.FC = () => {
  const { user } = useApp();

  // 1. Unauthenticated view
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
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
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
      </Router>
    );
  }

  // 3. Authenticated and Onboarded: Show Main layout & Navigation
  return (
    <Router>
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
