"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * A point-cloud "brain" — two lobes built from a gaussian sphere, sliced
 * down the middle, with a glowing neural lattice of connection lines and
 * orbiting synapse particles. Coral / amber / cyan / purple palette.
 */

function BrainCloud() {
  const ref = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const { positions, linePositions, colors } = useMemo(() => {
    const count = 4200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#ff6b6b"), // coral
      new THREE.Color("#ffcb6b"), // amber
      new THREE.Color("#89ddff"), // cyan
      new THREE.Color("#c792ea"), // purple
    ];

    for (let i = 0; i < count; i++) {
      // Two-lobe brain: offset gaussian blobs
      const lobe = i % 2 === 0 ? -0.42 : 0.42;
      const r = Math.pow(Math.random(), 0.5) * 1.55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      let x = r * Math.sin(phi) * Math.cos(theta) * 0.95 + lobe;
      let y = r * Math.sin(phi) * Math.sin(theta) * 0.85;
      let z = r * Math.cos(phi) * 0.8;

      // squeeze to brain-ish shape
      y *= 0.78;
      // central fissure gap
      const gap = Math.exp(-Math.pow(x / 0.18, 2));
      y -= gap * 0.12;
      x += (Math.random() - 0.5) * 0.04;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const c = palette[i % 4];
      const dim = 0.55 + Math.random() * 0.45;
      colors[i * 3] = c.r * dim;
      colors[i * 3 + 1] = c.g * dim;
      colors[i * 3 + 2] = c.b * dim;
    }

    // Build sparse connection lines between nearby points (synapse lattice)
    const linePositions: number[] = [];
    const sample = 380;
    for (let i = 0; i < sample; i++) {
      const ai = Math.floor(Math.random() * count);
      const ax = positions[ai * 3];
      const ay = positions[ai * 3 + 1];
      const az = positions[ai * 3 + 2];
      for (let k = 0; k < 4; k++) {
        const bi = Math.floor(Math.random() * count);
        const bx = positions[bi * 3];
        const by = positions[bi * 3 + 1];
        const bz = positions[bi * 3 + 2];
        const d = Math.hypot(ax - bx, ay - by, az - bz);
        if (d < 0.55 && d > 0.05) {
          linePositions.push(ax, ay, az, bx, by, bz);
        }
      }
    }

    return { positions, linePositions: new Float32Array(linePositions), colors };
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.12;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
    if (lineRef.current) {
      lineRef.current.rotation.y += delta * 0.12;
      lineRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group>
      <Points ref={ref} positions={positions} colors={colors} stride={3}>
        <PointMaterial
          transparent
          vertexColors
          size={0.035}
          sizeAttenuation
          depthWrite={false}
          opacity={0.92}
        />
      </Points>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff6b6b" transparent opacity={0.18} />
      </lineSegments>
    </group>
  );
}

function OrbitingSynapses() {
  const ref = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      const r = 2.2 + Math.random() * 1.2;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.25;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={ref}>
      <Points positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#ffcb6b"
          size={0.06}
          sizeAttenuation
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

function ScanRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.6;
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
      ref.current.scale.setScalar(s);
    }
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2.05, 2.12, 96]} />
      <meshBasicMaterial color="#ff6b6b" transparent opacity={0.35} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function NeuralBrain() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#ff6b6b" />
      <pointLight position={[-5, -3, -2]} intensity={0.8} color="#ffcb6b" />
      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.6}>
        <BrainCloud />
      </Float>
      <OrbitingSynapses />
      <ScanRing />
    </Canvas>
  );
}
