import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, LayoutDashboard, Bot } from 'lucide-react';

interface ComingSoonOverlayProps {
  title?: string;
  badge?: string;
  description?: string;
  primaryAction?: {
    text: string;
    to: string;
    icon?: React.ComponentType<any>;
  };
  secondaryAction?: {
    text: string;
    to: string;
    icon?: React.ComponentType<any>;
  };
}

export const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({
  title = "Coming Soon",
  badge = "Sneak Peek Preview",
  description = "Here is a sneak peek of the upcoming omnichannel conversation inbox! AutoReply AI is actively replying to your customer inquiries automatically in the background.",
  primaryAction = { text: "Go to Dashboard", to: "/", icon: LayoutDashboard },
  secondaryAction = { text: "AI Settings", to: "/ai", icon: Bot }
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-900/5 backdrop-blur-[1px] rounded-2xl animate-fade-in">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-8 text-center shadow-2xl space-y-5 animate-slide-in">
        
        {/* Icon with glow badge */}
        <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-lg animate-pulse-slow"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Badge & Title */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200/60 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping"></span>
            {badge}
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-800 font-outfit">
            {title}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          {primaryAction && (
            <Link
              to={primaryAction.to}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 glow-primary"
            >
              {primaryAction.icon && <primaryAction.icon className="h-4 w-4" />}
              <span>{primaryAction.text}</span>
            </Link>
          )}

          {secondaryAction && (
            <Link
              to={secondaryAction.to}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-200/80"
            >
              {secondaryAction.icon && <secondaryAction.icon className="h-4 w-4" />}
              <span>{secondaryAction.text}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
