"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/I18nProvider";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  closeLabel?: string;
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
}

export function Modal({ isOpen, onClose, title, closeLabel, children, className, hideHeader = false }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { dict } = useI18n();
  const defaultCloseLabel = closeLabel || dict.campForm.closeModal;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) {
        onClose();
      }
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleClick);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClick);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={title && !hideHeader ? titleId : undefined}
      aria-modal="true"
      className={cn(
        "fixed inset-0 m-auto p-0 rounded-3xl bg-surface-base shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] backdrop:bg-black/60 backdrop:backdrop-blur-sm",
        "w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/20",
        "open:animate-in open:fade-in open:zoom-in-95 duration-300 ease-out",
        className
      )}
    >
      <div className="flex flex-col h-full max-h-[90vh] relative">
        {!hideHeader && (
          <div className="flex items-center justify-between px-8 pt-8 pb-2">
            <h2 id={title ? titleId : undefined} className="text-2xl font-semibold tracking-tight text-content-base">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 -mr-2 text-content-subtle hover:text-content-base hover:bg-surface-subtle rounded-full transition-all duration-200"
              aria-label={defaultCloseLabel}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <title>{defaultCloseLabel}</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {hideHeader && (
           <button
             type="button"
             onClick={onClose}
             className="absolute top-6 right-6 z-10 p-2 text-content-subtle hover:text-content-base hover:bg-surface-subtle/80 rounded-full transition-all duration-200"
             aria-label={defaultCloseLabel}
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <title>{defaultCloseLabel}</title>
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        )}
        <div className="px-8 pb-8 pt-4 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
      </div>
    </dialog>
  );
}
