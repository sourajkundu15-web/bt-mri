"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * A futuristic 3D brain:
 *  - a translucent, subtly distorted two-lobe shell (back-side rendered)
 *  - a wireframe overlay of the same shell
 *  - glowing surface nodes (neurons) distributed across both lobes
 *  - animated firing synapse arcs between random node pairs
 *  - slow auto-rotation + float
 * Palette: coral / amber / cyan / purple.
 */

function lobePoint(lobeX: number) {
  // Sample a point inside a squashed sphere for one lobe
  const r = Math.pow(Math.random(), 0.33) * 1.55;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const x = r * Math.sin(phi) * Math.cos(theta) * 0.95 + lobeX;
  let y = r * Math.sin(phi) * Math.sin(theta) * 0.85;
  const z = r * Math.cos(phi) * 0.8;
  y *= 0.78;
  // central fissure dip
  const gap = Math.exp(-Math.pow(x / 0.18, 2));
  y -= gap * 0.12;
  return new THREE.Vector3(x, y, z);
}

function BrainShell() {
  // Distorted two-lobe geometry built from an icosphere, vertices pushed into a brain-ish shape.
  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.6, 6);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const nx = v.x;
      const ny = v.y;
      const nz = v.z;
      // squash + two-lobe split along x
      const lobe = nx < 0 ? -0.42 : 0.42;
      let x = Math.abs(nx) * 1.15 * Math.sign(nx) + lobe * 0.35;
      // keep the two lobes separate near the centre
      if (Math.abs(nx) < 0.12) x = nx * 0.6 + lobe * 0.5;
      let y = ny * 0.82;
      // central fissure
      const gap = Math.exp(-Math.pow(x / 0.2, 2));
      y -= gap * 0.18;
      const z = nz * 0.86;
      // wrinkly surface using layered sin noise
      const wrinkle =
        Math.sin(x * 6) * 0.04 +
        Math.sin(y * 7) * 0.035 +
        Math.sin(z * 8 + x * 3) * 0.03;
      const len = Math.hypot(x, y, z) || 1;
      const nx2 = x / len;
      const ny2 = y / len;
      const nz2 = z / len;
      pos.setXYZ(
        i,
        x + nx2 * wrinkle,
        y + ny2 * wrinkle,
        z + nz2 * wrinkle
      );
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group>
      {/* translucent inner shell */}
      <mesh geometry={geo}>
        <meshStandardMaterial
          color="#1c2190"
          emissive="#4a56a8"
          emissiveIntensity={0.35}
          transparent
          opacity={0.32}
          roughness={0.4}
          metalness={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* wireframe overlay */}
      <mesh geometry={geo}>
        <meshBasicMaterial
          color="#89ddff"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
    </group>
  );
}

function SurfaceNodes() {
  const palette = ["#ff6b6b", "#ffcb6b", "#89ddff", "#c792ea"];
  const COUNT = 90;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const c = palette.map((hex) => new THREE.Color(hex));
    for (let i = 0; i < COUNT; i++) {
      const lobeX = i % 2 === 0 ? -0.42 : 0.42;
      const p = lobePoint(lobeX);
      // push to near-surface (radius ~1.5)
      p.normalize().multiplyScalar(1.45 + Math.random() * 0.08);
      p.x += lobeX;
      p.y *= 0.82;
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

  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0015;
    }
    if (matRef.current) {
      matRef.current.size = 0.085 + Math.sin(state.clock.elapsedTime * 2) * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.085}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Synapses() {
  // Pre-generate a set of node pairs and animate small glowing spheres along arcs between them.
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
      const lobeX = Math.random() < 0.5 ? -0.42 : 0.42;
      const p = lobePoint(lobeX);
      p.normalize().multiplyScalar(1.45 + Math.random() * 0.06);
      p.x += lobeX;
      p.y *= 0.82;
      return p;
    };
    for (let i = 0; i < 14; i++) {
      const a = make();
      const b = make();
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(2.1); // bow outward
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
      // quadratic bezier a -> mid -> b
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
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.4;
      ref.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });
  return (
    <mesh ref={ref}>
      <ringGeometry args={[2.15, 2.2, 96]} />
      <meshBasicMaterial color="#ff6b6b" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function FuturisticBrain() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[5, 4, 5]} intensity={1.1} color="#ff6b6b" />
      <pointLight position={[-5, -3, -2]} intensity={0.8} color="#89ddff" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#c792ea" />
      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.5}>
        <BrainShell />
        <SurfaceNodes />
        <Synapses />
      </Float>
      <OrbitRing />
    </Canvas>
  );
}
