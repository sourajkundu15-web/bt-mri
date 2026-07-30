"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Snowflake, Sparkles, Zap } from "lucide-react";
import { SectionHeading, StaggerGroup, StaggerItem, GlowCard } from "./primitives";

export function Problem() {
  return (
    <section id="problem" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          index="01 · CONTEXT"
          kicker="Problem & Approach"
          title="Manual review is slow, subjective, and scarce"
          description="Brain tumors are visually heterogeneous and radiologist review is time-consuming, reader-dependent, and limited by specialist availability in low-resource settings. An automated CNN classifier can pre-rank scans, flag high-confidence cases, and augment — not replace — clinical review."
        />

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Problem card */}
          <StaggerGroup className="lg:col-span-2">
            <StaggerItem>
              <GlowCard className="h-full border-destructive/30">
                <div className="flex items-center gap-3 mb-4">
                  <span className="grid place-items-center w-10 h-10 rounded-lg bg-destructive/15 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-semibold">The bottleneck</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We frame this as a 4-class image classification task on T1-weighted contrast
                  MRI. The clinical goal is to surface the scans most likely to need urgent
                  specialist attention — not to issue a diagnosis.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {[
                    "Reader-dependent interpretation",
                    "Long turnaround in low-resource settings",
                    "Visually heterogeneous tumor morphology",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </StaggerItem>
          </StaggerGroup>

          {/* Approach flow */}
          <StaggerGroup className="lg:col-span-3">
            <div className="grid sm:grid-cols-3 gap-4">
              <StaggerItem>
                <GlowCard className="h-full">
                  <Snowflake className="w-6 h-6 text-cyan mb-3" />
                  <h4 className="font-semibold mb-1.5">Frozen backbone</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Reuse a deep ImageNet-pretrained VGG19 backbone for visual feature
                    extraction. Backprop never touches the conv weights.
                  </p>
                </GlowCard>
              </StaggerItem>
              <StaggerItem>
                <GlowCard className="h-full">
                  <Sparkles className="w-6 h-6 text-emerald mb-3" />
                  <h4 className="font-semibold mb-1.5">Fresh dense head</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Train a task-specific head — 2× Dense(4096) + softmax — on brain MRI to learn
                    tumor-specific decision boundaries.
                  </p>
                </GlowCard>
              </StaggerItem>
              <StaggerItem>
                <GlowCard className="h-full">
                  <Zap className="w-6 h-6 text-teal mb-3" />
                  <h4 className="font-semibold mb-1.5">Multi-metric</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Track accuracy, precision, recall &amp; AUC jointly — never accuracy alone —
                    for an honest clinical picture.
                  </p>
                </GlowCard>
              </StaggerItem>
            </div>

            <StaggerItem>
              <div className="mt-4 rounded-xl glass p-5">
                <div className="font-mono text-[11px] tracking-widest text-teal mb-3">
                  TRANSFER LEARNING FLOW
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {["ImageNet", "→", "VGG19 conv", "→", "Flatten", "→", "Dense×2", "→", "Softmax(4)"].map(
                    (t, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className={
                          t === "→"
                            ? "text-muted-foreground"
                            : "px-2.5 py-1 rounded-md bg-teal/10 border border-teal/30 text-foreground"
                        }
                      >
                        {t}
                      </motion.span>
                    )
                  )}
                </div>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
