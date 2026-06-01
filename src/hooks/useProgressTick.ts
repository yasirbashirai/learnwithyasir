import { useEffect, useState } from "react";

/**
 * Re-render when progress changes anywhere (lib/progress dispatches "lfy:progress").
 * Returns a tick number components can ignore — its only job is to force refresh.
 */
export function useProgressTick(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("lfy:progress", onChange);
    return () => window.removeEventListener("lfy:progress", onChange);
  }, []);
  return tick;
}
