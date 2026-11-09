import { AnimatePresence, MotionConfig } from "framer-motion";
import { lazy, Suspense, useCallback, useState } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Cursor from "./components/Cursor";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Intro, { shouldShowIntro } from "./components/Intro";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

const MorphField = lazy(() => import("./components/three/MorphField"));

function App() {
  const [showIntro, setShowIntro] = useState(shouldShowIntro);
  const finishIntro = useCallback(() => setShowIntro(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{showIntro ? <Intro key="intro" onDone={finishIntro} /> : null}</AnimatePresence>

      <Suspense fallback={null}>
        <MorphField />
      </Suspense>

      <Cursor />

      <div className="min-h-screen text-ink">
        <Navbar />
        <main>
          <Hero ready={!showIntro} />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
