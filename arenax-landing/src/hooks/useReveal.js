import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element has scrolled into view.
 * Returns a ref to attach to the element, and a boolean once it's visible.
 * Disconnects after the first reveal (one-shot, not re-triggered on scroll up).
 */
export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}
