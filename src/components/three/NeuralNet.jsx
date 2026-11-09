import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../../theme";
import { WebGLBoundary, windowPointer } from "./shared";

// Neurons per layer, input to output. Layers sit along the x axis; each layer's neurons form a ring.
const LAYERS = [4, 7, 9, 7, 3];
const LAYER_SPACING = 1.9;
const PULSE_COUNT = 36;

const PALETTES = {
  dark: { node: "#38bdf8", pulse: "#c084fc", edgeOpacity: 0.3, blending: THREE.AdditiveBlending },
  light: { node: "#2563eb", pulse: "#7c3aed", edgeOpacity: 0.22, blending: THREE.NormalBlending },
};

const GLOW_VERTEX = /* glsl */ `
  attribute float aSize;
  uniform float uPixelRatio;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * 40.0 / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const GLOW_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float core = smoothstep(0.22, 0.0, d);
    float halo = smoothstep(0.5, 0.0, d) * 0.45;
    gl_FragColor = vec4(uColor + core * 0.6, core + halo);
  }
`;

function buildNetwork() {
  const nodes = [];
  const layerStart = [];
  LAYERS.forEach((count, layer) => {
    layerStart.push(nodes.length);
    const x = (layer - (LAYERS.length - 1) / 2) * LAYER_SPACING;
    const radius = 0.5 + count * 0.13;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + layer * 0.4;
      nodes.push(new THREE.Vector3(x, Math.sin(angle) * radius, Math.cos(angle) * radius));
    }
  });

  // Fully connect consecutive layers, as in a dense network.
  const edges = [];
  for (let layer = 0; layer < LAYERS.length - 1; layer++) {
    for (let a = 0; a < LAYERS[layer]; a++) {
      for (let b = 0; b < LAYERS[layer + 1]; b++) {
        edges.push([layerStart[layer] + a, layerStart[layer + 1] + b]);
      }
    }
  }

  const edgePositions = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], i) => {
    nodes[a].toArray(edgePositions, i * 6);
    nodes[b].toArray(edgePositions, i * 6 + 3);
  });

  // Edges grouped by the layer they leave, so a pulse can continue forward when it arrives.
  const outgoing = nodes.map(() => []);
  edges.forEach(([a, b]) => outgoing[a].push(b));

  return { nodes, edgePositions, outgoing, inputCount: LAYERS[0] };
}

function Network({ animate, ready }) {
  const { theme } = useTheme();
  const palette = PALETTES[theme];
  const pixelRatio = useThree((state) => state.viewport.dpr);
  const groupRef = useRef(null);
  const nodeSizeAttr = useRef(null);
  const pulsePosAttr = useRef(null);

  const net = useMemo(buildNetwork, []);
  const nodePositions = useMemo(() => {
    const array = new Float32Array(net.nodes.length * 3);
    net.nodes.forEach((node, i) => node.toArray(array, i * 3));
    return array;
  }, [net]);
  const nodeSizes = useMemo(() => new Float32Array(net.nodes.length).fill(1), [net]);
  const activation = useMemo(() => new Float32Array(net.nodes.length), [net]);

  // Each pulse travels from one node to a node in the next layer, then carries on until it leaves the output layer.
  const pulses = useMemo(() => {
    const spawn = (pulse) => {
      pulse.from = Math.floor(Math.random() * net.inputCount);
      pulse.to = net.outgoing[pulse.from][Math.floor(Math.random() * net.outgoing[pulse.from].length)];
      pulse.speed = 0.6 + Math.random() * 0.8;
    };
    const list = Array.from({ length: PULSE_COUNT }, () => {
      const pulse = { t: Math.random() };
      spawn(pulse);
      return pulse;
    });
    return { list, spawn, positions: new Float32Array(PULSE_COUNT * 3), sizes: new Float32Array(PULSE_COUNT).fill(0.7) };
  }, [net]);

  const nodeUniforms = useMemo(() => ({ uPixelRatio: { value: pixelRatio }, uColor: { value: new THREE.Color() } }), [pixelRatio]);
  const pulseUniforms = useMemo(() => ({ uPixelRatio: { value: pixelRatio }, uColor: { value: new THREE.Color() } }), [pixelRatio]);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    nodeUniforms.uColor.value.set(palette.node);
    pulseUniforms.uColor.value.set(palette.pulse);
    invalidate();
  }, [palette, nodeUniforms, pulseUniforms, invalidate]);

  useFrame((state, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const delta = Math.min(rawDelta, 0.05);
    const time = state.clock.elapsedTime;

    // Grows in once the hero is shown, then sways (staying mostly face-on) and leans toward the pointer.
    const targetScale = ready ? 1 : 0.001;
    group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, targetScale, animate ? 0.04 : 1));
    const sway = animate ? Math.sin(time * 0.3) * 0.55 : 0.35;
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, sway + windowPointer.x * 0.4, 0.06);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0.25 - windowPointer.y * 0.25, 0.06);
    if (!animate) return;

    const { list, spawn, positions } = pulses;
    list.forEach((pulse, i) => {
      pulse.t += delta * pulse.speed;
      if (pulse.t >= 1) {
        activation[pulse.to] = 1;
        const next = net.outgoing[pulse.to];
        pulse.t = 0;
        if (next.length) {
          pulse.from = pulse.to;
          pulse.to = next[Math.floor(Math.random() * next.length)];
        } else {
          spawn(pulse);
        }
      }
      const a = net.nodes[pulse.from];
      const b = net.nodes[pulse.to];
      positions[i * 3] = a.x + (b.x - a.x) * pulse.t;
      positions[i * 3 + 1] = a.y + (b.y - a.y) * pulse.t;
      positions[i * 3 + 2] = a.z + (b.z - a.z) * pulse.t;
    });
    pulsePosAttr.current.needsUpdate = true;

    // Neurons flash when a pulse lands on them, then settle back.
    for (let i = 0; i < activation.length; i++) {
      activation[i] = Math.max(0, activation[i] - delta * 2.5);
      nodeSizes[i] = 1 + activation[i] * 1.4;
    }
    nodeSizeAttr.current.needsUpdate = true;
  });

  return (
    <group ref={groupRef} scale={0.001}>
      <lineSegments key={`edges-${theme}`}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={net.edgePositions} count={net.edgePositions.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={palette.node} transparent opacity={palette.edgeOpacity} depthWrite={false} blending={palette.blending} />
      </lineSegments>

      <points key={`nodes-${theme}`}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={nodePositions} count={net.nodes.length} itemSize={3} />
          <bufferAttribute ref={nodeSizeAttr} attach="attributes-aSize" array={nodeSizes} count={nodeSizes.length} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={nodeUniforms}
          vertexShader={GLOW_VERTEX}
          fragmentShader={GLOW_FRAGMENT}
          transparent
          depthWrite={false}
          blending={palette.blending}
        />
      </points>

      {animate ? (
        <points key={`pulses-${theme}`}>
          <bufferGeometry>
            <bufferAttribute ref={pulsePosAttr} attach="attributes-position" array={pulses.positions} count={PULSE_COUNT} itemSize={3} />
            <bufferAttribute attach="attributes-aSize" array={pulses.sizes} count={PULSE_COUNT} itemSize={1} />
          </bufferGeometry>
          <shaderMaterial
            uniforms={pulseUniforms}
            vertexShader={GLOW_VERTEX}
            fragmentShader={GLOW_FRAGMENT}
            transparent
            depthWrite={false}
            blending={palette.blending}
          />
        </points>
      ) : null}
    </group>
  );
}

// A slowly turning neural network with signals firing through it; sits behind the hero portrait.
function NeuralNet({ ready = true }) {
  const reducedMotion = useReducedMotion();

  return (
    <WebGLBoundary>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 7], fov: 50 }}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <Network animate={!reducedMotion} ready={ready} />
      </Canvas>
    </WebGLBoundary>
  );
}

export default NeuralNet;
