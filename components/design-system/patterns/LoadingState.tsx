import { Skeleton } from "@/components/design-system/primitives/Skeleton";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label }: LoadingStateProps) {
  const { dict } = useI18n();
  const loadingLabel = label || dict.appPages.loadingLabel;

  return (
    <div className="w-full space-y-6 p-8 border border-border-base bg-surface-base shadow-sm rounded-xl relative overflow-hidden" aria-live="polite" aria-busy="true">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/50 to-transparent animate-[pulse_2s_ease-in-out_infinite]" />
      <span className="sr-only">{loadingLabel}</span>
      <Skeleton className="h-8 w-1/3 bg-surface-subtle rounded-lg relative z-10" />
      <div className="space-y-3 relative z-10">
        <Skeleton className="h-3 w-full bg-surface-subtle rounded-md" />
        <Skeleton className="h-3 w-5/6 bg-surface-subtle rounded-md" />
        <Skeleton className="h-3 w-4/6 bg-surface-subtle rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 relative z-10">
        <Skeleton className="h-32 w-full bg-surface-muted border border-border-muted rounded-xl" />
        <Skeleton className="h-32 w-full bg-surface-muted border border-border-muted rounded-xl" />
        <Skeleton className="h-32 w-full bg-surface-muted border border-border-muted rounded-xl" />
      </div>
    </div>
  );
}

