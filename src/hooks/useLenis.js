import { useEffect } from 'react';
import Lenis from 'lenis';

// Smooth-scroll hook for pages that use free, continuous scrolling
// (Solar System, Gallery, About). Home uses native CSS scroll-snap
// instead, so it intentionally does NOT use this hook.
export default function useLenis({ enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let frameId;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [enabled]);
}
