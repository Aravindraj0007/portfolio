import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { skillGroups } from "../data/portfolio";
import { reveal3d } from "../motion";
import SectionHeader from "./SectionHeader";
import { icons } from "./icons";

const allSkills = skillGroups.flatMap((group) => group.items);
// Three orbits around the particle tree: canopy, trunk, and down by the floor.
const RINGS = [
  { y: -0.32, radius: 0.36, speed: 0.12 },
  { y: 0.02, radius: 0.44, speed: -0.09 },
  { y: 0.3, radius: 0.4, speed: 0.07 },
];

const perRing = Math.ceil(allSkills.length / RINGS.length);
const pills = allSkills.map((skill, index) => {
  const ring = index % RINGS.length;
  const slot = Math.floor(index / RINGS.length);
  return { skill, ring, angle: (slot / perRing) * Math.PI * 2 + ring * 0.7 };
});

// Skill pills orbiting in 3D. Positions are written straight to the DOM each frame to avoid re-rendering.
function SkillOrbit() {
  const containerRef = useRef(null);
  const pillRefs = useRef([]);
  const reducedMotion = useReducedMotion();


  useEffect(() => {
    let frame;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(containerRef.current);
    const start = performance.now();

    const place = (now) => {
      const box = containerRef.current;
      if (box && visible) {
        const width = box.clientWidth;
        const height = box.clientHeight;
        const t = reducedMotion ? 0 : (now - start) / 1000;
        pills.forEach((pill, i) => {
          const el = pillRefs.current[i];
          if (!el) return;
          const ring = RINGS[pill.ring];
          const angle = pill.angle + t * ring.speed;
          const depth = Math.cos(angle); // 1 = front, -1 = back
          const x = Math.sin(angle) * ring.radius * width;
          const y = ring.y * height + depth * 0.04 * height;
          const scale = 0.7 + (depth + 1) * 0.2;
          el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale})`;
          el.style.opacity = String(0.25 + (depth + 1) * 0.375);
          el.style.zIndex = String(Math.round((depth + 1) * 50));
          el.style.filter = depth < -0.3 ? "blur(1.5px)" : "none";
        });
      }
      if (!reducedMotion) frame = requestAnimationFrame(place);
    };
    frame = requestAnimationFrame(place);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} aria-hidden="true" className="relative mx-auto h-[26rem] max-w-5xl sm:h-[34rem]">
      {pills.map((pill, i) => (
        <span
          key={pill.skill}
          ref={(el) => {
            pillRefs.current[i] = el;
          }}
          className="glass absolute left-1/2 top-1/2 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium text-ink shadow-lg shadow-black/20 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          {pill.skill}
        </span>
      ))}
    </div>
  );
}

function Skills() {
  return (
    <section id="skills" className="overflow-x-clip py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeader
          index="03"
          label="Core stack"
          title="The stack I use to ship AI features."
          description="From AI agents and RAG to computer vision, APIs and real-time dashboards."
        />
      </div>

      <SkillOrbit />

      <div className="section-shell mt-8">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, index) => {
            const Icon = icons[group.icon];
            return (
              <motion.li key={group.title} className="glass rounded-2xl p-5" {...reveal3d(0.05 * index)}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <h3 className="font-semibold text-ink">{group.title}</h3>
                  <span className="ml-auto font-mono text-xs text-ink-muted">{String(group.items.length).padStart(2, "0")}</span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {group.items.map((skill) => (
                    <li key={skill} className="chip bg-transparent">
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Skills;
