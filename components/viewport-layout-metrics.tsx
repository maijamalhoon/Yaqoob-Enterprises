"use client";

import { useEffect } from "react";

/**
 * Publishes the real visual viewport, sticky header and mobile action-bar sizes
 * as CSS custom properties. CSS can then size experience sections against the
 * space the customer can actually see instead of assuming 100vh is usable.
 */
export function ViewportLayoutMetrics() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>(".site-header");
    const mobileActions = document.querySelector<HTMLElement>(".mobile-action-bar");
    const visualViewport = window.visualViewport;
    let frame = 0;

    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const viewportHeight = visualViewport?.height ?? window.innerHeight;
        const viewportWidth = visualViewport?.width ?? window.innerWidth;
        const headerHeight = header?.getBoundingClientRect().height ?? 0;

        let mobileActionHeight = 0;
        if (mobileActions) {
          const styles = window.getComputedStyle(mobileActions);
          const rect = mobileActions.getBoundingClientRect();
          if (styles.display !== "none" && styles.visibility !== "hidden" && rect.height > 0) {
            mobileActionHeight = rect.height;
          }
        }

        root.style.setProperty("--app-viewport-h", `${Math.round(viewportHeight)}px`);
        root.style.setProperty("--app-viewport-w", `${Math.round(viewportWidth)}px`);
        root.style.setProperty("--site-header-h", `${Math.round(headerHeight)}px`);
        root.style.setProperty("--mobile-action-h", `${Math.round(mobileActionHeight)}px`);
      });
    };

    const resizeObserver = new ResizeObserver(sync);
    if (header) resizeObserver.observe(header);
    if (mobileActions) resizeObserver.observe(mobileActions);

    window.addEventListener("resize", sync, { passive: true });
    window.addEventListener("orientationchange", sync, { passive: true });
    visualViewport?.addEventListener("resize", sync, { passive: true });
    visualViewport?.addEventListener("scroll", sync, { passive: true });
    sync();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      visualViewport?.removeEventListener("resize", sync);
      visualViewport?.removeEventListener("scroll", sync);
      root.style.removeProperty("--app-viewport-h");
      root.style.removeProperty("--app-viewport-w");
      root.style.removeProperty("--site-header-h");
      root.style.removeProperty("--mobile-action-h");
    };
  }, []);

  return null;
}
