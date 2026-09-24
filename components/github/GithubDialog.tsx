"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode, type MouseEvent } from "react";

type GithubDialogProps = {
  title: string;
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

export function GithubDialog({ title, labelledBy, onClose, children, wide = false }: GithubDialogProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function onOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
      onMouseDown={onOverlayClick}
      role="presentation"
    >
      <div
        aria-labelledby={labelledBy}
        aria-modal="true"
        className={`workspace-scrollbar max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-white/[0.1] bg-[#10141d] shadow-2xl sm:rounded-xl ${
          wide ? "sm:max-w-2xl" : "sm:max-w-lg"
        }`}
        role="dialog"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.07] bg-[#10141d]/95 px-4 py-3 backdrop-blur">
          <h2 className="truncate text-sm font-semibold text-white" id={labelledBy}>
            {title}
          </h2>
          <button
            aria-label="Close dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
            onClick={onClose}
            ref={closeRef}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}