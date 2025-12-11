/**
 * @fileoverview Hook to track a CSS media query's match state.
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 */

import { useSyncExternalStore } from "react";

export const useMediaQuery = (query: string) => {
  const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") return () => {};

    const mediaQuery = window.matchMedia(query);
    const handler = () => callback();

    mediaQuery.addEventListener("change", handler);
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  };

  const getSnapshot = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
