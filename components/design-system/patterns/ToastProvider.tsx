"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "@/components/design-system/primitives/Toast";

export type ToastVariant = "default" | "success" | "danger" | "warning";

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastItem = ToastInput & {
  id: string;
};

type ToastContextValue = {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function createToastId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);

    if (timer !== undefined) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const clear = useCallback(() => {
    timersRef.current.forEach((timer) => { window.clearTimeout(timer); });
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const toast = useCallback((input: ToastInput) => {
    const id = createToastId();
    const durationMs = input.durationMs ?? 4500;

    setToasts((current) => [
      ...current,
      {
        id,
        title: input.title,
        description: input.description,
        variant: input.variant ?? "default",
        durationMs,
      },
    ]);

    if (durationMs !== Number.POSITIVE_INFINITY) {
      const timer = window.setTimeout(() => {
        dismiss(id);
      }, durationMs);

      timersRef.current.set(id, timer);
    }

    return id;
  }, [dismiss]);

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => { window.clearTimeout(timer); });
      timers.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss, clear }), [toast, dismiss, clear]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100vw-2rem)] max-w-md flex-col gap-3 sm:bottom-6 sm:right-6 sm:w-full">
        {toasts.map((item) => (
          <Toast
            key={item.id}
            variant={item.variant}
            title={item.title}
            description={item.description}
            onDismiss={() => dismiss(item.id)}
            className="pointer-events-auto"
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (context === null) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
