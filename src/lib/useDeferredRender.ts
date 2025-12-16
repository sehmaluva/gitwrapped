"use client";

import { useEffect, useState } from "react";

export function useDeferredRender(delayMs: number = 1000) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const schedule = (cb: () => void) => {
      // Prefer idle callback when available
      if (typeof (window as any).requestIdleCallback === "function") {
        (window as any).requestIdleCallback(cb, { timeout: delayMs });
      } else {
        setTimeout(cb, delayMs);
      }
    };

    schedule(() => setReady(true));
  }, [delayMs]);

  return ready;
}
