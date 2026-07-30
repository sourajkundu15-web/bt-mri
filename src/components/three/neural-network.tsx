"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * A genuinely 3D layered neural network.
 * Layers recede along the X axis, each node also spans the Z axis so the
 * structure has real depth. A parent group continuously rotates around Y
 * (and tilts on X) so the 3D form is clearly visible — not a flat plane.
 * Palette: coral (input) → amber (hidden) → cyan / purple (output).
 */

type LayerDef = { count: number; x: number; color: string; zSpread: number };

const LAYERS: LayerDef[] = [
  { count: 7, x: -4.6, color: "#ff6b6b", zSpread: 3.2 }, // input
  { count: 11, x: -2.3, color: "#ffcb6b", zSpread: 3.8 }, // hidden 1
  { count: 9, x: 0, color: "#ffcb6b", zSpread: 4.0 }, // hidden 2
  { count: 7, x: 2.3, color: "#89ddff", zSpread: 3.8 }, // hidden 3
  { count: 4, x: 4.6, color: "#c792ea", zSpread: 2.8 }, // output
];

function layerNodes(layer: LayerDef) {
  const pts: THREE.Vector3[] = [];
  const n = layer.count;
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : (i / (n - 1) - 0.5) * 2.8;
    // spread nodes across Z so each layer is a 2D grid, not a line
    const z = (Math.random() - 0.5) * layer.zSpread;
    pts.push(new THREE.Vector3(layer.x, y, z));
  }
  return pts;
}

function NetworkNodes() {
  const allNodes = useMemo(() => LAYERS.map(layerNodes), []);

  const connections = useMemo(() => {
    const conns: [THREE.Vector3, THREE.Vector3, string][] = [];
    for (let li = 0; li < allNodes.length - 1; li++) {
      const a = allNodes[li];
      const b = allNodes[li + 1];
      for (const pa of a) {
        for (const pb of b) {
          conns.push([
            pa.clone(),
            pb.clone(),
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
    const s = 0.11 + pulse * 0.04;
    ref.current.scale.setScalar(s);
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.8 + pulse * 0.9;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 18, 18]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        roughness={0.25}
        metalness={0.3}
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
      lineWidth={0.5}
      transparent
      opacity={0.12}
    />
  );
}

/** Small spheres travelling along connections — the signal flow. */
function Pulses({
  connections,
}: {
  connections: [THREE.Vector3, THREE.Vector3, string][];
}) {
  const PULSE_COUNT = 26;
  const pulseData = useMemo(() => {
    const arr: { conn: number; speed: number; offset: number; color: string }[] = [];
    for (let i = 0; i < PULSE_COUNT; i++) {
      const ci = Math.floor(Math.random() * connections.length);
      arr.push({
        conn: ci,
        speed: 0.3 + Math.random() * 0.5,
        offset: Math.random(),
        color: connections[ci][2],
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
      const prog = (t * pd.speed + pd.offset) % 1;
      mesh.position.lerpVectors(from, to, prog);
      const fade = Math.sin(prog * Math.PI);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = fade * 0.95;
    });
  });

  return (
    <group>
      {pulseData.map((pd, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshes.current[i] = m;
          }}
        >
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={pd.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** Continuous rotation of the whole network so its 3D depth is obvious. */
function SpinGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    // steady Y rotation + a constant base tilt so depth reads even at rest
    ref.current.rotation.y += delta * 0.3;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.12 + 0.32;
  });
  return <group ref={ref}>{children}</group>;
}

export default function NeuralNetwork() {
  return (
    <Canvas
      camera={{ position: [3.5, 1.8, 8.5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[6, 4, 6]} intensity={1.2} color="#ff6b6b" />
      <pointLight position={[-6, -4, 4]} intensity={0.9} color="#89ddff" />
      <pointLight position={[0, 0, 8]} intensity={0.5} color="#c792ea" />
      <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.3}>
        <SpinGroup>
          <NetworkNodes />
        </SpinGroup>
      </Float>
    </Canvas>
  );
}
