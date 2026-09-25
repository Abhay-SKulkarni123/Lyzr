"use client";

import { useEffect, useRef, type Ref } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useDialogFocus<T extends HTMLElement>(enabled: boolean): Ref<T> {
  const ref = useRef<T>(null);
  const previouslyFocused = useRef<Element | null>(null);

  useEffect(() => {
    if (!enabled) return;
    previouslyFocused.current = document.activeElement;

    const root = ref.current;
    if (!root) return;
    const element: T = root;

    function focusables() {
      return Array.from(element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !element.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !element.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused.current instanceof HTMLElement && previouslyFocused.current.isConnected) {
        previouslyFocused.current.focus();
      }
    };
  }, [enabled]);

  return ref;
}