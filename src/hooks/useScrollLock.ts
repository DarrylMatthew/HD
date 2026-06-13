import { useEffect } from 'react';
import { getLenis } from './useLenis';

// Number of overlays currently requesting a scroll lock. Body scroll (and Lenis
// smooth-scroll) stay disabled while this is > 0 and are only restored when the
// last overlay releases. Ref-counting makes the lock order-independent, so
// overlapping overlays (e.g. cart -> edit panel -> back to cart) never leave the
// page unlocked mid-transition or locked after everything closes.
let lockCount = 0;

function applyLock() {
  document.body.style.overflow = 'hidden';
  getLenis()?.stop();
}

function releaseLock() {
  document.body.style.overflow = '';
  getLenis()?.start();
}

/**
 * Locks page scroll while `active` (default true) and the owning component is
 * mounted. Safe to use from multiple overlays at once.
 */
export function useScrollLock(active: boolean = true) {
  useEffect(() => {
    if (!active) return;
    lockCount += 1;
    if (lockCount === 1) applyLock();
    return () => {
      lockCount -= 1;
      if (lockCount === 0) releaseLock();
    };
  }, [active]);
}
