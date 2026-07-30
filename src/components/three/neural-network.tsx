"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * A 3D layered feed-forward neural network.
 * 5 layers (8 → 12 → 10 → 8 → 4) of glowing nodes connected by faint lines,
 * with animated signal pulses travelling left → right along the connections.
 * Palette: coral (input) → amber (hidden) → cyan/purple (output).
 */

type LayerDef = { count: number; x: number; color: string };

const LAYERS: LayerDef[] = [
  { count: 8, x: -4.2, color: "#ff6b6b" }, // input
  { count: 12, x: -2.1, color: "#ffcb6b" }, // hidden 1
  { count: 10, x: 0, color: "#ffcb6b" }, // hidden 2
  { count: 8, x: 2.1, color: "#89ddff" }, // hidden 3
  { count: 4, x: 4.2, color: "#c792ea" }, // output
];

const SPREAD = 2.6; // vertical spread of nodes within a layer

function layerNodes(layer: LayerDef) {
  const pts: THREE.Vector3[] = [];
  const n = layer.count;
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : (i / (n - 1) - 0.5) * SPREAD;
    pts.push(new THREE.Vector3(layer.x, y, 0));
  }
  return pts;
}

function NetworkNodes() {
  // Build all node positions
  const allNodes = useMemo(() => LAYERS.map(layerNodes), []);

  // Connection list: [fromVec, toVec] pairs between consecutive layers
  const connections = useMemo(() => {
    const conns: [THREE.Vector3, THREE.Vector3, string][] = [];
    for (let li = 0; li < allNodes.length - 1; li++) {
      const a = allNodes[li];
      const b = allNodes[li + 1];
      for (const pa of a) {
        for (const pb of b) {
          // subtle z-offset per connection for depth
          const zA = pa.z + (Math.random() - 0.5) * 0.15;
          const zB = pb.z + (Math.random() - 0.5) * 0.15;
          conns.push([
            new THREE.Vector3(pa.x, pa.y, zA),
            new THREE.Vector3(pb.x, pb.y, zB),
            LAYERS[li + 1].color,
          ]);
        }
      }
    }
    return conns;
  }, [allNodes]);

  return (
    <group>
      {allNodes.map((nodes, li) => (
        <group key={li}>
          {nodes.map((p, i) => (
            <Node key={`${li}-${i}`} position={p} color={LAYERS[li].color} index={i} />
          ))}
        </group>
      ))}

      {connections.map((c, i) => (
        <Connection key={i} from={c[0]} to={c[1]} color={c[2]} />
      ))}

      <Pulses connections={connections} />
    </group>
  );
}

function Node({
  position,
  color,
  index,
}: {
  position: THREE.Vector3;
  color: string;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.6 + index * 0.7 + position.x);
    const s = 0.085 + pulse * 0.03;
    ref.current.scale.setScalar(s);
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.7 + pulse * 0.8;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}

function Connection({
  from,
  to,
  color,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  color: string;
}) {
  return (
    <Line
      points={[from, to]}
      color={color}
      lineWidth={0.6}
      transparent
      opacity={0.16}
    />
  );
}

/** Small spheres that travel along a rotating subset of connections (signal flow). */
function Pulses({
  connections,
}: {
  connections: [THREE.Vector3, THREE.Vector3, string][];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const PULSE_COUNT = 22;
  const pulseData = useMemo(() => {
    const arr: { conn: number; speed: number; offset: number; color: string }[] = [];
    for (let i = 0; i < PULSE_COUNT; i++) {
      arr.push({
        conn: Math.floor(Math.random() * connections.length),
        speed: 0.35 + Math.random() * 0.55,
        offset: Math.random(),
        color: connections[Math.floor(Math.random() * connections.length)][2],
      });
    }
    return arr;
  }, [connections]);

  const meshes = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    pulseData.forEach((pd, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      const [from, to] = connections[pd.conn];
      const prog = ((t * pd.speed + pd.offset) % 1);
      const eased = prog; // linear travel
      mesh.position.lerpVectors(from, to, eased);
      const fade = Math.sin(prog * Math.PI); // bright in the middle
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = fade * 0.9;
    });
  });

  return (
    <group ref={groupRef}>
      {pulseData.map((pd, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshes.current[i] = m;
          }}
        >
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshBasicMaterial color={pd.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Rig() {
  useFrame((state) => {
    // gentle auto-rotation of the whole scene
    state.scene.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.12) * 0.18;
    state.scene.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.08) * 0.06;
  });
  return null;
}

export default function NeuralNetwork() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 4, 6]} intensity={1.1} color="#ff6b6b" />
      <pointLight position={[-6, -4, 4]} intensity={0.8} color="#89ddff" />
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <NetworkNodes />
      </Float>
      <Rig />
    </Canvas>
  );
}
