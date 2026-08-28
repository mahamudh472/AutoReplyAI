import React, { createContext, useContext, useState, useEffect } from 'react';
import type { BillingState } from '../types/billing';
import { DEFAULT_BILLING } from '../constants/defaults';

export interface BillingContextType {
  billing: BillingState;
  incrementMessageUsage: (count?: number) => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [billing, setBilling] = useState<BillingState>(() => {
    const saved = localStorage.getItem('replyai_billing');
    return saved ? JSON.parse(saved) : DEFAULT_BILLING;
  });

  useEffect(() => {
    localStorage.setItem('replyai_billing', JSON.stringify(billing));
  }, [billing]);

  const incrementMessageUsage = (count = 1) => {
    setBilling((prev) => ({
      ...prev,
      messagesUsed: Math.min(prev.messagesUsed + count, prev.messageLimit),
    }));
  };

  return (
    <BillingContext.Provider value={{ billing, incrementMessageUsage }}>
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};
