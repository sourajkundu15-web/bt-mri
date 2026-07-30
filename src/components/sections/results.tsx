"use client";

import { motion } from "framer-motion";
import { SectionHeading, StaggerGroup, StaggerItem, CountUp } from "./primitives";
import { whatWorked, whatsNext } from "@/lib/site-data";
import { Check, ArrowRight, Trophy } from "lucide-react";

export function Results() {
  const finalStats = [
    { label: "Validation Accuracy", value: 94.75, suffix: "%", decimals: 2 },
    { label: "Validation AUC", value: 99.11, suffix: "%", decimals: 2 },
    { label: "Validation Precision", value: 94.81, suffix: "%", decimals: 2 },
    { label: "Validation Recall", value: 94.69, suffix: "%", decimals: 2 },
  ];

  return (
    <section id="results" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          index="07 · CONCLUSION"
          kicker="Final Results"
          title="A clinically-promising VGG19 baseline"
          description="Transfer learning reaches clinical-grade precision on a 4-class MRI task with only ~7k images — but the work isn't done. The roadmap below targets the glioma↔meningioma gap and interpretability."
        />

        {/* Final stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {finalStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-xl glass-strong p-6 text-center overflow-hidden group"
            >
              <div className="relative">
                <div className="text-3xl sm:text-4xl font-bold text-gradient-coral tabular-nums">
                  <CountUp to={s.value} decimals={s.decimals} suffix={s.suffix} />
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground mt-2">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* What worked */}
          <StaggerGroup>
            <StaggerItem>
              <div className="rounded-xl glass p-6 h-full border-amber/30">
                <div className="flex items-center gap-3 mb-5">
                  <span className="grid place-items-center w-10 h-10 rounded-lg bg-amber/15 text-amber">
                    <Check className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-semibold">What worked</h3>
                </div>
                <ul className="space-y-4">
                  {whatWorked.map((w) => (
                    <li key={w} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber shrink-0" />
                      <span className="leading-relaxed">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          </StaggerGroup>

          {/* What's next */}
          <StaggerGroup>
            <StaggerItem>
              <div className="rounded-xl glass p-6 h-full border-coral/30">
                <div className="flex items-center gap-3 mb-5">
                  <span className="grid place-items-center w-10 h-10 rounded-lg bg-coral/15 text-coral">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-semibold">What&apos;s next</h3>
                </div>
                <ul className="space-y-4">
                  {whatsNext.map((w) => (
                    <li key={w} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <ArrowRight className="w-4 h-4 text-coral shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>

        {/* closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 rounded-2xl glass-strong p-8 sm:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-amber/10" />
          <div className="relative">
            <Trophy className="w-10 h-10 text-amber mx-auto mb-4" />
            <p className="text-xl sm:text-2xl font-semibold text-gradient-coral max-w-2xl mx-auto leading-relaxed">
              &gt;94% accuracy on a 4-class brain-tumor MRI task — with only ~7k images and a
              frozen VGG19 backbone.
            </p>
            <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto">
              Brain Tumor Classification from MRI Scans · VGG19 Transfer Learning · BT-MRI
              Dataset (7,023 scans)
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
