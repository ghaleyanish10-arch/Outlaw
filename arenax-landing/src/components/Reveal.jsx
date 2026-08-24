import React from "react";
import { useReveal } from "../hooks/useReveal.js";

/**
 * Wraps any content and animates it in (fade + slide up) the first time
 * it scrolls into the viewport. Accepts an optional delay (ms) for staggering.
 */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", style = {}, children }) {
  const [ref, visible] = useReveal();

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(.16,.8,.28,1) ${delay}ms, transform 0.7s cubic-bezier(.16,.8,.28,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
