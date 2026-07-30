"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./primitives";
import { pipeline, type PipelineStage } from "@/lib/site-data";
import { Snowflake, Flame, ScanLine } from "lucide-react";

const stateMeta: Record<
  PipelineStage["state"],
  { label: string; color: string; icon: typeof Snowflake }
> = {
  frozen: { label: "FROZEN", color: "#89ddff", icon: Snowflake },
  trainable: { label: "TRAINABLE", color: "#ff6b6b", icon: Flame },
  io: { label: "DATA", color: "#ffcb6b", icon: ScanLine },
};

export function Pipeline() {
  return (
    <section id="pipeline" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          index="03 · PIPELINE"
          kicker="End-to-end Pipeline"
          title="From MRI scan to diagnosis — six stages"
          description="Only the dense head and softmax update during training. The VGG19 convolutional weights stay at their ImageNet values, preserving rich low-level visual features learned on millions of natural images."
        />

        <div className="section-reveal relative">
          {/* Desktop horizontal flow */}
          <div className="hidden lg:block">
            <svg
              className="absolute top-[58px] left-0 w-full h-2 pointer-events-none"
              viewBox="0 0 1000 8"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="4"
                x2="1000"
                y2="4"
                stroke="#ff6b6b"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                className="animate-dash-flow"
                opacity="0.4"
              />
            </svg>
            <div className="grid grid-cols-6 gap-3 relative">
              {pipeline.map((s, i) => {
                const meta = stateMeta[s.state];
                return (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                    className="relative"
                  >
                    {/* node */}
                    <div className="flex flex-col items-center">
                      <div
                        className="relative grid place-items-center w-[116px] h-[116px] rounded-full glass border-2"
                        style={{ borderColor: meta.color + "66" }}
                      >
                        <meta.icon
                          className="relative w-7 h-7"
                          style={{ color: meta.color }}
                        />
                        <span className="absolute -top-2 -right-2 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-background border border-coral/40 text-coral">
                          {s.step}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="font-semibold text-sm">{s.title}</div>
                      <div className="text-[10px] font-mono mt-1 px-2 py-0.5 rounded inline-block"
                        style={{ background: meta.color + "1a", color: meta.color }}
                      >
                        {meta.label}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile vertical flow */}
          <div className="lg:hidden space-y-3">
            {pipeline.map((s, i) => {
              const meta = stateMeta[s.state];
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 rounded-lg glass p-4"
                >
                  <div
                    className="relative grid place-items-center w-14 h-14 rounded-full shrink-0 border-2"
                    style={{ borderColor: meta.color + "66" }}
                  >
                    <meta.icon className="w-6 h-6" style={{ color: meta.color }} />
                    <span className="absolute -top-1 -right-1 text-[9px] font-mono px-1 rounded-full bg-background border border-coral/40 text-coral">
                      {s.step}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{s.title}</span>
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                        style={{ background: meta.color + "1a", color: meta.color }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* legend */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs">
            {(Object.keys(stateMeta) as PipelineStage["state"][]).map((k) => {
              const m = stateMeta[k];
              return (
                <div key={k} className="flex items-center gap-2 text-muted-foreground">
                  <m.icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                  {m.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
