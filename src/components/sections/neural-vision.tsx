"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { BrainCircuit, Cpu, Layers, Sparkles } from "lucide-react";

const FuturisticBrain = dynamic(() => import("@/components/three/futuristic-brain"), {
  ssr: false,
});

const features = [
  {
    icon: Layers,
    title: "Layered cognition",
    text: "Five tiers of neurons — input, three hidden, output — mirror a deep CNN's decision flow.",
    color: "text-coral",
  },
  {
    icon: Cpu,
    title: "Frozen backbone",
    text: "VGG19's convolutional weights stay at ImageNet values; only the dense head learns.",
    color: "text-amber",
  },
  {
    icon: Sparkles,
    title: "Synaptic firing",
    text: "Signal pulses travel the lattice in real time — a live map of inference in motion.",
    color: "text-cyan",
  },
];

export function NeuralVision() {
  return (
    <section id="neural-vision" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* 3D futuristic brain */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-square max-w-[520px] mx-auto">
              {/* faint backdrop ring */}
              <div className="absolute inset-6 rounded-full border border-coral/15" />
              <div className="absolute inset-0">
                <FuturisticBrain />
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <div className="order-1 lg:order-2 section-reveal">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs text-coral/80 tracking-widest">★ · VISION</span>
              <span className="h-px w-10 bg-coral/40" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                The model, visualized
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gradient-coral leading-[1.1]">
              A futuristic brain,
              <br />
              built from a neural lattice
            </h2>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              The classifier you&apos;re about to meet isn&apos;t a black box. Every glowing node is
              a neuron; every firing arc is a signal racing toward a 4-way diagnosis. This is what
              transfer learning looks like under the hood.
            </p>

            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="rounded-lg glass p-4 hover:border-coral/45 transition-colors"
                >
                  <f.icon className={`w-5 h-5 mb-2.5 ${f.color}`} />
                  <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs font-mono text-muted-foreground">
              <BrainCircuit className="w-4 h-4 text-purple" />
              <span>VGG19 · 378.7M params · 4-class softmax</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
