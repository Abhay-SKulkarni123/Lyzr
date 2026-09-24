"use client";

import { useEffect, useRef, useState, type ReactNode, type ComponentType } from "react";

export type MenuItem = {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  href?: string;
  onSelect?: () => void;
  danger?: boolean;
};

type MenuProps = {
  trigger: ReactNode;
  items: MenuItem[];
  align?: "left" | "right";
  label: string;
};

export function Menu({ trigger, items, align = "right", label }: MenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocumentPress(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocumentPress);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocumentPress);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          aria-label={label}
          className={`absolute z-40 mt-1.5 min-w-[168px] overflow-hidden rounded-lg border border-white/10 bg-[#1a212e] p-1 shadow-2xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) => {
            const content = (
              <span className="flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-xs">
                {item.icon && <item.icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 opacity-70" />}
                <span className={item.danger ? "text-rose-300" : "text-slate-300"}>{item.label}</span>
              </span>
            );
            const className = `flex items-center rounded-md transition hover:bg-white/[0.07] ${
              item.danger ? "text-rose-300" : "text-slate-300"
            }`;
            return item.href ? (
              <a
                key={item.label}
                role="menuitem"
                className={className}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {content}
              </a>
            ) : (
              <button
                key={item.label}
                role="menuitem"
                className={`${className} w-full`}
                onClick={() => {
                  setOpen(false);
                  item.onSelect?.();
                }}
                type="button"
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}