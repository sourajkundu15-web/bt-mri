"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown, Activity, Scan } from "lucide-react";
import { CountUp } from "./primitives";

const NeuralBrain = dynamic(() => import("@/components/three/neural-brain"), {
  ssr: false,
});

export function Hero() {
  return (
    <section
      id="overview"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* grid + radial backdrop */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* 3D brain — right side on desktop, behind text on mobile */}
      <div className="absolute inset-0 lg:right-0 lg:left-1/2">
        <NeuralBrain />
      </div>
      <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-background lg:via-background/70 lg:to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-mono mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-teal opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
            </span>
            <span className="text-teal tracking-widest">CLINICAL ML · 4-CLASS CNN</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Brain Tumor
            <br />
            <span className="text-gradient-teal glow-text">Classification</span>
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl text-muted-foreground font-semibold">
              from MRI Scans
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl"
          >
            Fine-tuning a VGG19 transfer-learning backbone on{" "}
            <span className="text-foreground font-medium">7,023 T1-weighted MRI scans</span> to
            classify four tumor types — reaching clinical-grade precision without training a
            network from scratch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
          >
            {[
              { label: "Validation Acc", value: 94.75, suffix: "%", decimals: 2, icon: Activity },
              { label: "Validation AUC", value: 99.11, suffix: "%", decimals: 2, icon: Scan },
              { label: "MRI Scans", value: 7023, suffix: "", decimals: 0, icon: Activity },
              { label: "Tumor Classes", value: 4, suffix: "", decimals: 0, icon: Scan },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg glass p-3 sm:p-4 hover:border-teal/50 transition-colors"
              >
                <s.icon className="w-4 h-4 text-teal mb-2" />
                <div className="text-xl sm:text-2xl font-bold tabular-nums text-foreground">
                  <CountUp to={s.value} decimals={s.decimals} suffix={s.suffix} />
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() =>
                document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })
              }
              className="group inline-flex items-center gap-2 rounded-lg bg-teal text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-teal/90 transition-colors glow-teal"
            >
              Explore the study
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
            <div className="font-mono text-xs text-muted-foreground">
              VGG19 TRANSFER LEARNING · BT-MRI DATASET
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-muted-foreground"
      >
        <span className="text-[10px] font-mono tracking-widest">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-teal/60 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
