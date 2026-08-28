import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';
import type { AITone, AIProvider } from '../../types/ai';

interface AIPlaygroundPreviewProps {
  tone: AITone;
  provider: AIProvider;
  businessName: string;
}

export const AIPlaygroundPreview: React.FC<AIPlaygroundPreviewProps> = ({
  tone,
  provider,
  businessName,
}) => {
  const [previewCustomerQuery, setPreviewCustomerQuery] = useState('Do you offer international shipping?');

  const cyclePreviewQuery = () => {
    const queries = [
      'Do you offer international shipping?',
      'What are your store business hours?',
      'Can I return an item after 30 days?',
      'Are the keyboards hot-swappable?',
      'Do you have any discount promo codes?',
    ];
    const currentIndex = queries.indexOf(previewCustomerQuery);
    const nextIndex = (currentIndex + 1) % queries.length;
    setPreviewCustomerQuery(queries[nextIndex]);
  };

  const getSimulatedResponse = () => {
    if (tone === 'friendly') {
      return `Hello! 😊 Yes, ${businessName || 'our store'} offers fast shipping worldwide! Standard shipping takes 3-5 business days and is calculated at checkout. Let me know if you need help with anything else!`;
    }
    if (tone === 'formal') {
      return `Greetings. Please be advised that ${businessName || 'our company'} provides shipping services domestically and internationally. Full rates and estimated timelines are presented during checkout.`;
    }
    if (tone === 'casual') {
      return `Hey there! Yeah, we definitely ship worldwide. Super quick 3-5 days delivery. You can check rates directly in the cart!`;
    }
    return `Hello! Yes, ${businessName || 'our business'} provides worldwide shipping. Standard delivery takes 3-5 business days, and exact rates are calculated at checkout before order confirmation.`;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold text-slate-800 font-outfit">AI Response Preview</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Simulated with <span className="font-semibold text-slate-600">{tone}</span> tone
          </p>
        </div>
        <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-600 text-[9px] font-bold uppercase">
          {provider}
        </span>
      </div>

      {/* Preview Chat Panel */}
      <div className="border border-slate-150 rounded-2xl p-4 bg-[#fbfcfd] space-y-3">
        {/* Customer */}
        <div className="flex justify-end">
          <div className="px-3.5 py-2 bg-blue-50 text-blue-800 rounded-2xl rounded-tr-none text-xs max-w-[85%] font-medium">
            {previewCustomerQuery}
          </div>
        </div>

        {/* AI */}
        <div className="flex justify-start items-start gap-2">
          <div className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[10px]">
            🤖
          </div>
          <div className="px-3.5 py-2 bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none text-xs leading-normal max-w-[85%] shadow-sm">
            {getSimulatedResponse()}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={cyclePreviewQuery}
        className="w-full py-2.5 rounded-xl border border-blue-600/30 hover:bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <RotateCw className="h-3.5 w-3.5" />
        Test another query
      </button>
    </div>
  );
};
