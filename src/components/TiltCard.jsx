import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const MAX_TILT = 10;
const spring = { stiffness: 220, damping: 20, mass: 0.6 };

// A card that tilts toward the mouse in 3D, with a moving light glare.
// Children can use `[transform:translateZ(..)]` to float above the card surface.
function TiltCard({ as = "article", className = "", children }) {
  const MotionTag = motion[as];
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const glareOpacity = useMotionValue(0);

  const rotateX = useSpring(useTransform(pointerY, [0, 1], [MAX_TILT, -MAX_TILT]), spring);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-MAX_TILT, MAX_TILT]), spring);
  const glareX = useTransform(pointerX, (value) => `${value * 100}%`);
  const glareY = useTransform(pointerY, (value) => `${value * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(var(--accent) / 0.18), transparent 55%)`;
  const smoothGlare = useSpring(glareOpacity, spring);

  const handlePointerMove = (event) => {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
    glareOpacity.set(1);
  };

  const handlePointerLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
    glareOpacity.set(0);
  };

  return (
    <MotionTag
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      className={`group relative ${className}`}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: glare, opacity: smoothGlare }}
      />
    </MotionTag>
  );
}

export default TiltCard;
