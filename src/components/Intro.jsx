import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/ar-logo.png";
import { personalInfo } from "../data/portfolio";

// Reveal (2.2s) + hold, before fading into the site.
const DURATION_MS = 3200;
// If the logo is slow to load, give up waiting and go straight to the site.
const LOAD_TIMEOUT_MS = 2500;
const INTRO_SEEN_KEY = "intro-seen";

export function shouldShowIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return !sessionStorage.getItem(INTRO_SEEN_KEY);
  } catch {
    return true;
  }
}

// The AR monogram slowly comes into focus, then fades into the site. Esc or a click skips it.
function Intro({ onDone }) {
  const imageRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // Without storage the intro just plays again next visit.
    }
    // A cached image can finish loading before React attaches onLoad.
    if (imageRef.current?.complete) setLoaded(true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") onDone();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onDone]);

  useEffect(() => {
    const id = window.setTimeout(onDone, loaded ? DURATION_MS : LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [loaded, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      onClick={onDone}
    >
      <motion.img
        ref={imageRef}
        src={logo}
        alt={`${personalInfo.name} monogram`}
        onLoad={() => setLoaded(true)}
        className="w-[min(80vw,480px)] select-none"
        draggable="false"
        initial={{ opacity: 0, scale: 0.9, filter: "blur(14px)" }}
        animate={loaded ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

export default Intro;
