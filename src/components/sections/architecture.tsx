"use client";

import { motion } from "framer-motion";
import { SectionHeading, StaggerGroup, StaggerItem, CountUp } from "./primitives";
import { layers, paramBreakdown, modelCode } from "@/lib/site-data";
import { Snowflake, Flame, Boxes, Cpu } from "lucide-react";

export function Architecture() {
  return (
    <section id="architecture" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          index="04 · MODEL"
          kicker="Architecture"
          title="VGG19 backbone + a heavy custom head"
          description="The pretrained VGG19 convolutional base (20M params) is frozen. Only the flatten layer and two 4096-unit dense ReLU layers + a 4-unit softmax are trained — many weights come from flattening the 7×7×512 feature map into 25,088 inputs."
        />

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Code panel */}
          <div className="lg:col-span-3 section-reveal">
            <div className="rounded-xl overflow-hidden glass-strong">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-teal/15 bg-teal/5">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald/60" />
                </div>
                <span className="font-mono text-xs text-muted-foreground ml-2">model.py</span>
                <span className="ml-auto font-mono text-[10px] text-teal/70">CELL 1</span>
              </div>
              <pre className="p-4 sm:p-5 overflow-x-auto text-[12.5px] leading-relaxed font-mono">
                <code>
                  {modelCode.split("\n").map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="whitespace-pre"
                    >
                      <span className="text-muted-foreground/40 select-none mr-4 inline-block w-6 text-right">
                        {i + 1}
                      </span>
                      <span
                        className={
                          line.trim().startsWith("#")
                            ? "text-muted-foreground/60"
                            : "text-foreground"
                        }
                      >
                        {line.replace(/^\s+/, (m) => m) || " "}
                      </span>
                    </motion.div>
                  ))}
                </code>
              </pre>
            </div>
          </div>

          {/* Param breakdown */}
          <div className="lg:col-span-2 space-y-4">
            <StaggerGroup>
              {paramBreakdown.map((p) => (
                <StaggerItem key={p.label}>
                  <div className="rounded-xl glass p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{p.label}</span>
                      <Boxes className="w-4 h-4" style={{ color: p.color }} />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold tabular-nums" style={{ color: p.color }}>
                        <CountUp to={p.value} decimals={1} />
                      </span>
                      <span className="text-sm text-muted-foreground">{p.unit}</span>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: p.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(p.value / 378.7) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>

        {/* Layers table */}
        <div className="mt-8 section-reveal rounded-xl glass overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-teal/15 bg-teal/5">
            <Cpu className="w-4 h-4 text-teal" />
            <span className="font-semibold text-sm">Layer-by-layer topology</span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              model.summary()
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-teal/10">
                  <th className="px-5 py-3 font-medium">Layer</th>
                  <th className="px-5 py-3 font-medium">Output shape</th>
                  <th className="px-5 py-3 font-medium">Params</th>
                  <th className="px-5 py-3 font-medium">State</th>
                </tr>
              </thead>
              <tbody>
                {layers.map((l, i) => (
                  <motion.tr
                    key={`${l.layer}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="border-b border-teal/5 hover:bg-teal/5 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-foreground">{l.layer}</td>
                    <td className="px-5 py-3 font-mono text-muted-foreground">{l.shape}</td>
                    <td className="px-5 py-3 font-mono text-teal">{l.params}</td>
                    <td className="px-5 py-3">
                      {l.status === "frozen" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-cyan">
                          <Snowflake className="w-3.5 h-3.5" /> Frozen
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald">
                          <Flame className="w-3.5 h-3.5" /> Trainable
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
