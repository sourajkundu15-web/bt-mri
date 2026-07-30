"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Futuristic 3D brain — built on the user-supplied Three.js approach:
 *   - a wireframe sphere (MeshStandardMaterial, wireframe: true, color 0x61dafb)
 *     deformed into a two-lobe brain shape
 *   - rotation.x += 0.01 and rotation.y += 0.01 per frame (continuous spin)
 *   - PointLight(0xffffff, 3) + AmbientLight(0x333333) lighting rig
 * Plus glowing surface neurons + firing synapse arcs for the "futuristic" feel.
 */

/** Sample a point inside one brain lobe (squashed sphere + central fissure). */
function lobePoint(lobeX: number) {
  const r = Math.pow(Math.random(), 0.33) * 1.5;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const x = r * Math.sin(phi) * Math.cos(theta) * 0.95 + lobeX;
  let y = r * Math.sin(phi) * Math.sin(theta) * 0.85;
  const z = r * Math.cos(phi) * 0.82;
  y *= 0.78;
  const gap = Math.exp(-Math.pow(x / 0.18, 2));
  y -= gap * 0.12;
  return new THREE.Vector3(x, y, z);
}

/**
 * The brain body: a SphereGeometry deformed into two lobes with gyral wrinkles,
 * rendered with the user's wireframe MeshStandardMaterial (0x61dafb).
 */
function BrainMesh() {
  const geo = useMemo(() => {
    // Start from a sphere (matching the user's SphereGeometry(1.5, 32, 32) sizing)
    const g = new THREE.SphereGeometry(1.5, 48, 48);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const nx = v.x;
      const ny = v.y;
      const nz = v.z;
      // two-lobe split along x
      const lobe = nx < 0 ? -0.4 : 0.4;
      const pinch = Math.exp(-Math.pow(nx / 0.22, 2));
      const x = nx + lobe * 0.32 * pinch;
      const y = ny * (1 - pinch * 0.35);
      const z = nz * 0.88;
      // gyral wrinkles — layered sinusoidal noise
      const wrinkle =
        Math.sin(x * 7 + nz * 2) * 0.045 +
        Math.sin(y * 9 + x * 3) * 0.035 +
        Math.sin(z * 8) * 0.03;
      const len = Math.hypot(x, y, z) || 1;
      pos.setXYZ(
        i,
        x + (x / len) * wrinkle,
        y + (y / len) * wrinkle,
        z + (z / len) * wrinkle
      );
    }
    g.computeVertexNormals();
    return g;
  }, []);

  // User's material: MeshStandardMaterial({ color: 0x61dafb, wireframe: true })
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={0x61dafb} wireframe />
    </mesh>
  );
}

/** Glowing neuron points scattered across both lobes. */
function SurfaceNeurons() {
  const palette = ["#ff6b6b", "#ffcb6b", "#89ddff", "#c792ea"];
  const COUNT = 110;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const c = palette.map((hex) => new THREE.Color(hex));
    for (let i = 0; i < COUNT; i++) {
      const lobeX = i % 2 === 0 ? -0.4 : 0.4;
      const p = lobePoint(lobeX);
      p.normalize().multiplyScalar(1.46 + Math.random() * 0.08);
      p.x += lobeX * 0.2;
      p.y *= 0.8;
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
      const col = c[i % palette.length];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return { positions, colors };
  }, []);

  const matRef = useRef<THREE.PointsMaterial>(null);
  useFrame((state) => {
    if (matRef.current) {
      matRef.current.size = 0.09 + Math.sin(state.clock.elapsedTime * 2) * 0.018;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.09}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Firing synapse arcs — glowing spheres travelling along bezier curves. */
function Synapses() {
  const pairs = useMemo(() => {
    const palette = ["#ff6b6b", "#ffcb6b", "#89ddff", "#c792ea"];
    const arr: {
      a: THREE.Vector3;
      b: THREE.Vector3;
      mid: THREE.Vector3;
      color: string;
      speed: number;
      offset: number;
    }[] = [];
    const make = () => {
      const lobeX = Math.random() < 0.5 ? -0.4 : 0.4;
      const p = lobePoint(lobeX);
      p.normalize().multiplyScalar(1.46 + Math.random() * 0.06);
      p.x += lobeX * 0.2;
      p.y *= 0.8;
      return p;
    };
    for (let i = 0; i < 16; i++) {
      const a = make();
      const b = make();
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(2.2);
      arr.push({
        a,
        b,
        mid,
        color: palette[i % palette.length],
        speed: 0.25 + Math.random() * 0.4,
        offset: Math.random(),
      });
    }
    return arr;
  }, []);

  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    pairs.forEach((p, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      const prog = (t * p.speed + p.offset) % 1;
      const u = prog;
      const inv = 1 - u;
      const x = inv * inv * p.a.x + 2 * inv * u * p.mid.x + u * u * p.b.x;
      const y = inv * inv * p.a.y + 2 * inv * u * p.mid.y + u * u * p.b.y;
      const z = inv * inv * p.a.z + 2 * inv * u * p.mid.z + u * u * p.b.z;
      mesh.position.set(x, y, z);
      const fade = Math.sin(prog * Math.PI);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = fade * 0.95;
    });
  });

  return (
    <group>
      {pairs.map((p, i) => (
        <mesh
          key={i}
          ref={(m) => {
            meshes.current[i] = m;
          }}
        >
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * The brain group — matches the user's animation loop:
 *   brainMesh.rotation.x += 0.01;
 *   brainMesh.rotation.y += 0.01;
 */
function BrainGroup() {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    // Exact rotation increments from the user's animate() loop
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });
  return (
    <group ref={ref}>
      <BrainMesh />
      <SurfaceNeurons />
      <Synapses />
    </group>
  );
}

export default function FuturisticBrain() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* User's lighting rig: PointLight(0xffffff, 3, 100) at (5,5,5) + AmbientLight(0x333333) */}
      <pointLight position={[5, 5, 5]} intensity={3} distance={100} color={0xffffff} />
      <ambientLight intensity={0.2} color={0x333333} />
      {/* extra colored accents for the futuristic palette */}
      <pointLight position={[-5, -3, -2]} intensity={1.2} color={0xff6b6b} />
      <pointLight position={[0, 4, 3]} intensity={0.8} color={0xc792ea} />
      <BrainGroup />
    </Canvas>
  );
}
