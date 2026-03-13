import { Skeleton } from "@/components/design-system/primitives/Skeleton";

export function LoadingState() {
  return (
    <div className="w-full space-y-4 py-8" aria-live="polite" aria-busy="true">
      <span className="sr-only">콘텐츠를 불러오는 중</span>
      <Skeleton className="h-8 w-1/3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
