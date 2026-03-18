"use client";
import { Button } from "@/components/design-system/primitives/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = "Something went wrong", 
  message = "An error occurred while loading this content.", 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8 w-full h-full min-h-[400px] bg-red-400 border-8 border-content-base shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+PC9zdmc+')]">
      <div className="bg-white border-4 border-content-base p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-xl text-center rotate-[2deg]">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-red-600">{title}</h2>
        <p className="text-xl font-bold text-content-base">{message}</p>
      </div>
      {onRetry && (
        <Button variant="brutal" onClick={onRetry} className="bg-white text-content-base hover:bg-black hover:text-white h-16 px-12 text-xl rotate-[-2deg]">
          Try Again
        </Button>
      )}
    </div>
  );
}
