// Shared scroll-driven 3D reveal: elements tilt back in perspective and fly up into place as they enter view.
export const reveal3d = (delay = 0) => ({
  initial: { opacity: 0, y: 60, rotateX: 18, transformPerspective: 1200 },
  whileInView: { opacity: 1, y: 0, rotateX: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
});
