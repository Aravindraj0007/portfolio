import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../../theme";
import { cloudShape, cubeShape, galaxyShape, orbShape, treeShape } from "./shapes";
import { WebGLBoundary, windowPointer } from "./shared";

// One shape per page section, in page order. The particles morph from one to the next as you scroll.
const SECTION_IDS = ["top", "about", "work", "skills", "contact"];
// Where each shape sits on desktop and on phones, and how strongly the rippling floor shows under it.
const STAGES = [
  { offset: [2.9, -0.35, 0], mobile: [0, -2.3, 0], floor: 1 },
  { offset: [0, 0, -0.5], mobile: [0, 0, -0.5], floor: 0.35 },
  { offset: [0, 0.2, -1], mobile: [0, 0, -1], floor: 0.35 },
  { offset: [0, -0.2, 0], mobile: [0, -0.4, 0], floor: 1 },
  { offset: [0, 0.3, -1], mobile: [0, 0, -1], floor: 0.6 },
];

const PALETTES = {
  dark: { a: "#38bdf8", b: "#7c5cff", hot: "#e0f2fe", size: 30, alpha: 0.85, floor: "#4f6bff", blending: THREE.AdditiveBlending },
  light: { a: "#1d4ed8", b: "#7c3aed", hot: "#1e3a8a", size: 30, alpha: 0.7, floor: "#3b5bdb", blending: THREE.NormalBlending },
};

const MORPH_VERTEX = /* glsl */ `
  attribute vec3 aShape1;
  attribute vec3 aShape2;
  attribute vec3 aShape3;
  attribute vec3 aShape4;
  attribute vec4 aRand;
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  varying float vMix;
  varying float vAlpha;
  varying float vHot;

  vec3 shapeAt(float i) {
    if (i < 0.5) return position;
    if (i < 1.5) return aShape1;
    if (i < 2.5) return aShape2;
    if (i < 3.5) return aShape3;
    return aShape4;
  }

  void main() {
    float p = clamp(uProgress, 0.0, 4.0);
    float index = min(floor(p), 3.0);
    float f = p - index;
    // Each particle leaves a little earlier or later than its neighbours, so the morph looks organic.
    float t = smoothstep(aRand.x * 0.45, aRand.x * 0.45 + 0.55, f);
    vec3 pos = mix(shapeAt(index), shapeAt(index + 1.0), t);

    // Mid-morph, particles burst outward into a cloud.
    float burst = sin(t * 3.14159);
    vec3 dir = normalize(vec3(sin(aRand.w * 43.1), cos(aRand.y * 71.7), sin(aRand.z * 19.3)) + 0.0001);
    pos += dir * burst * (0.8 + aRand.y * 1.6);

    // A gentle idle shimmer.
    pos += 0.025 * vec3(sin(uTime * 1.1 + aRand.w * 6.28), cos(uTime * 0.9 + aRand.x * 6.28), sin(uTime * 0.7 + aRand.z * 6.28));

    vec4 world = modelMatrix * vec4(pos, 1.0);

    // The cursor pushes particles away, leaving a dent.
    vec2 away = world.xy - uMouse.xy;
    float dist = length(away);
    float force = smoothstep(1.3, 0.0, dist) * uMouseStrength;
    world.xy += normalize(away + 0.0001) * force * 0.7;
    world.z += force * 0.4;

    vec4 mv = viewMatrix * world;
    gl_PointSize = uSize * (0.45 + aRand.y * 0.9) * uPixelRatio / -mv.z;
    gl_Position = projectionMatrix * mv;

    vMix = aRand.z;
    vHot = step(0.93, aRand.w) + force;
    vAlpha = (0.35 + aRand.y * 0.65) * (1.0 - burst * 0.35);
  }
`;

const MORPH_FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorHot;
  uniform float uAlpha;
  varying float vMix;
  varying float vAlpha;
  varying float vHot;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    vec3 color = mix(uColorA, uColorB, vMix);
    color = mix(color, uColorHot, clamp(vHot, 0.0, 1.0) * 0.7);
    gl_FragColor = vec4(color, smoothstep(0.5, 0.05, d) * vAlpha * uAlpha);
  }
`;

const FLOOR_VERTEX = /* glsl */ `
  attribute float aRand;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float r = length(p.xz);
    float wave = sin(r * 2.1 - uTime * 1.3);
    float crest = smoothstep(0.55, 1.0, wave);
    p.y += wave * 0.07;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (14.0 + crest * 22.0) * (0.6 + aRand * 0.6) * uPixelRatio / -mv.z;
    gl_Position = projectionMatrix * mv;
    vAlpha = (0.06 + crest * 0.8) * smoothstep(9.5, 2.5, r) * uOpacity;
  }
`;

const FLOOR_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vAlpha);
  }
`;

const smoothstep = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

// Scroll position → shape index (0..4). Each morph plays while the next section rises through the viewport.
function scrollProgress() {
  const vh = window.innerHeight;
  const y = window.scrollY;
  let progress = 0;
  for (let k = 1; k < SECTION_IDS.length; k++) {
    const el = document.getElementById(SECTION_IDS[k]);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + y;
    progress += smoothstep(top - vh * 0.85, top - vh * 0.2, y);
  }
  return progress;
}

const CUBE_SIZE = 2.8;
// How much bigger than the photo the cube is drawn.
const CUBE_MARGIN = 1.12;
const _ndc = new THREE.Vector3();
const _centre = new THREE.Vector3();
const _top = new THREE.Vector3();

// Where a screen pixel lands on the z = 0 plane the shapes live on.
function screenToPlane(camera, x, y, out) {
  _ndc.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5).unproject(camera).sub(camera.position).normalize();
  return out.copy(camera.position).addScaledVector(_ndc, -camera.position.z / _ndc.z);
}

// Centre the cube on #hero-portrait and size it to frame the photo. Returns false if the photo isn't on the page.
function fitToPortrait(camera, fit) {
  const el = document.getElementById("hero-portrait");
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  if (!rect.height) return false;
  const cx = rect.left + rect.width / 2;
  screenToPlane(camera, cx, rect.top + rect.height / 2, _centre);
  screenToPlane(camera, cx, rect.top, _top);
  fit.offset[0] = _centre.x;
  fit.offset[1] = _centre.y;
  fit.offset[2] = 0;
  fit.scale = (_centre.distanceTo(_top) * 2 * CUBE_MARGIN) / CUBE_SIZE;
  return true;
}

function Particles({ animate }) {
  const { theme } = useTheme();
  const palette = PALETTES[theme];
  const pixelRatio = useThree((state) => state.viewport.dpr);
  const camera = useThree((state) => state.camera);
  const groupRef = useRef(null);
  const progressRef = useRef(scrollProgress());
  const mouseWorld = useMemo(() => new THREE.Vector3(99, 99, 0), []);
  const lastPointer = useRef({ x: 0, y: 0, active: 0 });
  const isMobile = window.innerWidth < 768;

  const geometry = useMemo(() => {
    const count = isMobile ? 7000 : 14000;
    const shapes = [cubeShape(count, "", CUBE_SIZE), orbShape(count), cloudShape(count), treeShape(count), galaxyShape(count)];
    const rand = new Float32Array(count * 4);
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
    shapes.slice(1).forEach((shape, i) => g.setAttribute(`aShape${i + 1}`, new THREE.BufferAttribute(shape, 3)));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);
    return g;
  }, [isMobile]);

  const floorGeometry = useMemo(() => {
    const count = isMobile ? 5000 : 10000;
    const positions = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 9.5 * Math.sqrt(Math.random());
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(a) * r;
      rand[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    return g;
  }, [isMobile]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: progressRef.current },
      uTime: { value: 0 },
      uSize: { value: 30 },
      uPixelRatio: { value: pixelRatio },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uMouseStrength: { value: 0 },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uColorHot: { value: new THREE.Color() },
      uAlpha: { value: 1 },
    }),
    [pixelRatio]
  );
  const floorUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: pixelRatio }, uOpacity: { value: 1 }, uColor: { value: new THREE.Color() } }),
    [pixelRatio]
  );

  useEffect(() => {
    uniforms.uColorA.value.set(palette.a);
    uniforms.uColorB.value.set(palette.b);
    uniforms.uColorHot.value.set(palette.hot);
    uniforms.uSize.value = palette.size * (isMobile ? 0.8 : 1);
    uniforms.uAlpha.value = palette.alpha;
    floorUniforms.uColor.value.set(palette.floor);
  }, [palette, uniforms, floorUniforms, isMobile]);

  useEffect(() => () => {
    geometry.dispose();
    floorGeometry.dispose();
  }, [geometry, floorGeometry]);

  const ray = useMemo(() => new THREE.Vector3(), []);
  const heroFit = useMemo(() => ({ offset: [0, 0, 0], scale: 1 }), []);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (animate) {
      uniforms.uTime.value += delta;
      floorUniforms.uTime.value += delta;
    }

    const target = scrollProgress();
    progressRef.current = animate ? THREE.MathUtils.damp(progressRef.current, target, 3.5, delta) : target;
    const p = progressRef.current;
    uniforms.uProgress.value = p;

    // Blend placement and floor strength between the two stages we're morphing between.
    const i = Math.min(Math.floor(p), STAGES.length - 2);
    const f = THREE.MathUtils.clamp(p - i, 0, 1);
    const a = STAGES[i];
    const b = STAGES[i + 1];
    const group = groupRef.current;
    const baseScale = isMobile ? 0.62 : 1;
    // The hero cube wraps the portrait: follow the photo's on-screen box (it moves with scroll and layout).
    const placement = (stage) => {
      if (stage === 0 && fitToPortrait(camera, heroFit)) return heroFit;
      return { offset: isMobile ? STAGES[stage].mobile : STAGES[stage].offset, scale: baseScale };
    };
    const from = placement(i);
    const to = placement(i + 1);
    group.position.set(
      THREE.MathUtils.lerp(from.offset[0], to.offset[0], f),
      THREE.MathUtils.lerp(from.offset[1], to.offset[1], f),
      THREE.MathUtils.lerp(from.offset[2], to.offset[2], f)
    );
    group.scale.setScalar(THREE.MathUtils.lerp(from.scale, to.scale, f));
    floorUniforms.uOpacity.value = THREE.MathUtils.lerp(a.floor, b.floor, f);

    const time = uniforms.uTime.value;
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, Math.sin(time * 0.25) * 0.55 - 0.3 + windowPointer.x * 0.25, 0.05);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0.12 - windowPointer.y * 0.12, 0.05);

    // Cursor position on the z = 0 plane, for the repulsion dent.
    const pointer = lastPointer.current;
    if (pointer.x !== windowPointer.x || pointer.y !== windowPointer.y) {
      pointer.x = windowPointer.x;
      pointer.y = windowPointer.y;
      pointer.active = 1;
    }
    pointer.active = Math.max(0, pointer.active - delta * 0.4);
    ray.set(windowPointer.x, windowPointer.y, 0.5).unproject(camera).sub(camera.position).normalize();
    const distance = -camera.position.z / ray.z;
    mouseWorld.copy(camera.position).addScaledVector(ray, distance);
    uniforms.uMouse.value.lerp(mouseWorld, 0.25);
    uniforms.uMouseStrength.value = THREE.MathUtils.damp(uniforms.uMouseStrength.value, isMobile ? 0 : pointer.active, 4, delta);

    // Slight camera parallax toward the pointer.
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, windowPointer.x * 0.35, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <group ref={groupRef}>
        <points key={`p-${theme}`} geometry={geometry}>
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={MORPH_VERTEX}
            fragmentShader={MORPH_FRAGMENT}
            transparent
            depthWrite={false}
            blending={palette.blending}
          />
        </points>
      </group>
      <points key={`f-${theme}`} geometry={floorGeometry} position={[0, -3.25, -1.5]}>
        <shaderMaterial
          uniforms={floorUniforms}
          vertexShader={FLOOR_VERTEX}
          fragmentShader={FLOOR_FRAGMENT}
          transparent
          depthWrite={false}
          blending={palette.blending}
        />
      </points>
    </>
  );
}

// Full-screen particle scene behind the whole page.
function MorphField() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <WebGLBoundary>
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0.4, 9], fov: 50 }}
        >
          <Particles animate={!reducedMotion} />
        </Canvas>
      </WebGLBoundary>
    </div>
  );
}

export default MorphField;
