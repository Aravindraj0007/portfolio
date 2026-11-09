import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

// A ring that trails the mouse and grows over links and buttons. Mouse-only; the native cursor stays.
function Cursor() {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });

  useEffect(() => {
    setEnabled(window.matchMedia("(pointer: fine)").matches && !reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) return undefined;
    const onMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      setHovering(Boolean(event.target.closest?.("a, button, [role='tab'], input, textarea, label")));
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center rounded-full border border-ink/70 mix-blend-difference"
      style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: hovering ? 46 : 26, height: hovering ? 46 : 26, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <span className="h-1 w-1 rounded-full bg-ink" />
    </motion.div>
  );
}

export default Cursor;
