"use client";
import { Button } from "@/components/design-system/primitives/Button";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title, 
  message, 
  onRetry 
}: ErrorStateProps) {
  const { dict } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 w-full h-full min-h-[300px] bg-slate-50/50 rounded-xl border border-slate-200">
      <div className="bg-white border border-red-100 p-6 shadow-sm rounded-xl w-full max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center bg-red-50 text-red-600 rounded-full mb-4 ring-4 ring-red-50/50">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-2 text-slate-900">{title || dict.appPages.errorTitle}</h2>
        <p className="text-sm text-slate-500">{message || dict.appPages.errorDesc}</p>
      </div>
      {onRetry && (
        <Button variant="primary" onClick={onRetry} className="h-10 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all">
          {dict.appPages.retry}
        </Button>
      )}
    </div>
  );
}
