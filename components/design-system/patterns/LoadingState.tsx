import { Skeleton } from "@/components/design-system/primitives/Skeleton";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "콘텐츠를 불러오는 중" }: LoadingStateProps) {
  return (
    <div className="w-full space-y-8 py-12 p-8 border-8 border-content-base bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden" aria-live="polite" aria-busy="true">
      <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,#000,#000_10px,transparent_10px,transparent_20px)] animate-[marquee_20s_linear_infinite]" />
      <span className="sr-only">{label}</span>
      <Skeleton className="h-16 w-1/2 bg-yellow-300 border-4 border-content-base rounded-none relative z-10" />
      <div className="space-y-4 relative z-10">
        <Skeleton className="h-6 w-full bg-slate-200 border-2 border-content-base rounded-none" />
        <Skeleton className="h-6 w-5/6 bg-slate-200 border-2 border-content-base rounded-none" />
        <Skeleton className="h-6 w-4/6 bg-slate-200 border-2 border-content-base rounded-none" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 relative z-10">
        <Skeleton className="h-48 w-full bg-blue-300 border-4 border-content-base rounded-none" />
        <Skeleton className="h-48 w-full bg-purple-300 border-4 border-content-base rounded-none" />
        <Skeleton className="h-48 w-full bg-green-300 border-4 border-content-base rounded-none" />
      </div>
    </div>
  );
}

