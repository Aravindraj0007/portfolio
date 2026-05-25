import About from "./components/About";
import CodingProfiles from "./components/CodingProfiles";
import Contact from "./components/Contact";
import Education from "./components/Education";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

function App() {
  return (
    <div className="mesh-bg min-h-screen text-slate-100">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <CodingProfiles />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
