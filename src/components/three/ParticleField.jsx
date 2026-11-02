import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useTheme } from "../../theme";
import { WebGLBoundary, windowPointer } from "./shared";

const FIELD = { width: 26, height: 30, depth: 14 };
const PALETTES = {
  dark: { color: "#38bdf8", opacity: 0.55, blending: THREE.AdditiveBlending },
  light: { color: "#2563eb", opacity: 0.28, blending: THREE.NormalBlending },
};

// Particles drift upward like a data stream and wrap around the camera,
// so the field never runs out however far the page scrolls.
const FIELD_VERTEX = /* glsl */ `
  attribute float aSpeed;
  uniform float uTime;
  uniform float uCameraY;
  uniform float uHeight;
  uniform float uPixelRatio;
  varying float vFade;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * aSpeed - uCameraY + uHeight * 0.5, uHeight) - uHeight * 0.5 + uCameraY;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    vFade = smoothstep(-22.0, -8.0, mvPosition.z);
    gl_PointSize = (2.0 + aSpeed * 6.0) * uPixelRatio * 6.0 / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FIELD_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * uOpacity * vFade);
  }
`;

function Field({ animate }) {
  const { theme } = useTheme();
  const palette = PALETTES[theme];
  const pixelRatio = useThree((state) => state.viewport.dpr);
  const invalidate = useThree((state) => state.invalidate);

  const { positions, speeds } = useMemo(() => {
    const count = window.innerWidth < 768 ? 600 : 1400;
    const positionArray = new Float32Array(count * 3);
    const speedArray = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positionArray[i * 3] = (Math.random() - 0.5) * FIELD.width;
      positionArray[i * 3 + 1] = (Math.random() - 0.5) * FIELD.height;
      positionArray[i * 3 + 2] = -Math.random() * FIELD.depth - 1;
      speedArray[i] = 0.05 + Math.random() * 0.3;
    }
    return { positions: positionArray, speeds: speedArray };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCameraY: { value: 0 },
      uHeight: { value: FIELD.height },
      uPixelRatio: { value: pixelRatio },
      uColor: { value: new THREE.Color() },
      uOpacity: { value: 0.5 },
    }),
    [pixelRatio]
  );

  useEffect(() => {
    uniforms.uColor.value.set(palette.color);
    uniforms.uOpacity.value = palette.opacity;
    invalidate();
  }, [palette, uniforms, invalidate]);

  // Scrolling moves the camera down through the field and slowly rolls it, which gives the page depth.
  useFrame(({ camera }, delta) => {
    const scroll = window.scrollY;
    const targetY = -scroll * 0.004;
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, animate ? 0.08 : 1);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, windowPointer.x * 0.6, 0.05);
    camera.rotation.z = -scroll * 0.00008;
    uniforms.uCameraY.value = camera.position.y;
    if (animate) uniforms.uTime.value += Math.min(delta, 0.05);
  });

  return (
    <points key={theme}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-aSpeed" array={speeds} count={speeds.length} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={FIELD_VERTEX}
        fragmentShader={FIELD_FRAGMENT}
        transparent
        depthWrite={false}
        blending={palette.blending}
      />
    </points>
  );
}

function ParticleField() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <WebGLBoundary>
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
          camera={{ position: [0, 0, 6], fov: 60 }}
          frameloop={reducedMotion ? "demand" : "always"}
        >
          <Field animate={!reducedMotion} />
        </Canvas>
      </WebGLBoundary>
    </div>
  );
}

export default ParticleField;
