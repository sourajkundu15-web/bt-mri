"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A futuristic 3D brain:
 *  - a solid two-lobe body with a gyral/wrinkled surface (emissive, fresnel-like)
 *  - glowing surface neurons distributed across both lobes
 *  - animated firing synapse arcs between random neuron pairs
 *  - continuous slow rotation so the 3D form reads clearly
 * Palette: coral / amber / cyan / purple on the deep-indigo base.
 */

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

function BrainBody() {
  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.55, 7);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const nx = v.x;
      const ny = v.y;
      const nz = v.z;
      // two-lobe split along x
      const lobe = nx < 0 ? -0.4 : 0.4;
      let x = nx;
      // pinch centre to create the longitudinal fissure
      const pinch = Math.exp(-Math.pow(nx / 0.22, 2));
      x = nx + lobe * 0.32 * pinch;
      let y = ny * (1 - pinch * 0.35);
      const z = nz * 0.88;
      // gyral wrinkles — layered sinusoidal noise along the surface
      const wrinkle =
        Math.sin(x * 7 + nz * 2) * 0.045 +
        Math.sin(y * 9 + x * 3) * 0.035 +
        Math.sin(z * 8) * 0.03 +
        Math.sin(x * 14 + y * 11) * 0.015;
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
      {/* solid brain body — emissive, translucent */}
      <mesh geometry={geo}>
        <meshStandardMaterial
          color="#2a30a0"
          emissive="#ff6b6b"
          emissiveIntensity={0.18}
          transparent
          opacity={0.55}
          roughness={0.35}
          metalness={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* subtle wireframe overlay for the tech feel */}
      <mesh geometry={geo}>
        <meshBasicMaterial
          color="#89ddff"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

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
      // project to just outside the surface
      p.normalize().multiplyScalar(1.5 + Math.random() * 0.08);
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

  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  useFrame((state) => {
    if (matRef.current) {
      matRef.current.size = 0.09 + Math.sin(state.clock.elapsedTime * 2) * 0.018;
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
      p.normalize().multiplyScalar(1.5 + Math.random() * 0.06);
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

function OrbitRing({
  radius,
  color,
  opacity,
  speed,
  tilt,
}: {
  radius: number;
  color: string;
  opacity: number;
  speed: number;
  tilt: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.04, 96]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Continuous rotation so the brain's 3D form is unmistakable. */
function BrainSpin({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.18;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.12;
  });
  return <group ref={ref}>{children}</group>;
}

export default function FuturisticBrain() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 4, 5]} intensity={1.3} color="#ff6b6b" />
      <pointLight position={[-5, -3, -2]} intensity={0.9} color="#89ddff" />
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#c792ea" />
      <BrainSpin>
        <BrainBody />
        <SurfaceNeurons />
        <Synapses />
      </BrainSpin>
      <OrbitRing radius={2.15} color="#ff6b6b" opacity={0.28} speed={0.4} tilt={0} />
      <OrbitRing radius={2.35} color="#89ddff" opacity={0.18} speed={-0.3} tilt={0.4} />
    </Canvas>
  );
}
