import { AnimatePresence, MotionConfig } from "framer-motion";
import { lazy, Suspense, useCallback, useState } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Intro, { shouldShowIntro } from "./components/Intro";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

const ParticleField = lazy(() => import("./components/three/ParticleField"));

function App() {
  const [showIntro, setShowIntro] = useState(shouldShowIntro);
  const finishIntro = useCallback(() => setShowIntro(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{showIntro ? <Intro key="intro" onDone={finishIntro} /> : null}</AnimatePresence>

      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>

      <div className="min-h-screen text-ink">
        <Navbar />
        <main>
          <Hero ready={!showIntro} />
          <Projects />
          <About />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
