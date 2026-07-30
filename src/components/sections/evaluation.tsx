"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { SectionHeading, StaggerGroup, StaggerItem } from "./primitives";
import { confusionMatrix, tumorClasses } from "@/lib/site-data";
import { Grid3x3, Lightbulb } from "lucide-react";

export function Evaluation() {
  const { labels, rows } = confusionMatrix;
  const max = Math.max(...rows.flat());
  const total = rows.flat().reduce((a, b) => a + b, 0);

  const classColors = ["#ff6b6b", "#ffcb6b", "#89ddff", "#c792ea"];

  return (
    <section id="evaluation" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          index="06 · EVALUATION"
          kicker="Confusion Matrix"
          title="Where the model succeeds — and slips"
          description="Evaluated on 911 held-out test scans. Rows are the true class, columns the predicted class. The diagonal is correct; off-diagonal mass concentrates on the Glioma↔Meningioma overlap — a known radiological ambiguity."
        />

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Confusion matrix */}
          <div className="lg:col-span-3 section-reveal">
            <div className="rounded-xl glass p-6">
              <div className="flex items-center gap-2 mb-5">
                <Grid3x3 className="w-4 h-4 text-coral" />
                <h3 className="font-semibold text-sm">911 test scans · 4×4 confusion matrix</h3>
              </div>

              <div className="flex gap-3">
                {/* y-axis label */}
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[10px] font-mono tracking-widest text-muted-foreground -rotate-90 whitespace-nowrap">
                    TRUE CLASS
                  </span>
                </div>

                <div className="flex-1">
                  <div className="overflow-x-auto">
                    <div className="min-w-[320px]">
                      {/* grid */}
                      <div
                        className="grid gap-1.5"
                        style={{ gridTemplateColumns: `auto repeat(${labels.length}, 1fr)` }}
                      >
                        <div />
                        {labels.map((l) => (
                          <div
                            key={l}
                            className="text-[10px] font-mono text-center text-muted-foreground pb-1.5 truncate"
                          >
                            {l}
                          </div>
                        ))}

                        {rows.map((row, ri) => (
                          <Fragment key={`row-${ri}`}>
                            <div
                              className="text-[10px] font-mono text-muted-foreground self-center pr-1.5 truncate"
                            >
                              {labels[ri]}
                            </div>
                            {row.map((val, ci) => {
                              const isDiag = ri === ci;
                              const intensity = val / max;
                              return (
                                <motion.div
                                  key={`cell-${ri}-${ci}`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: (ri * 4 + ci) * 0.03 }}
                                  className="relative aspect-square rounded-md grid place-items-center group cursor-default"
                                  style={{
                                    background: isDiag
                                      ? `rgba(255, 107, 107, ${0.22 + intensity * 0.6})`
                                      : `rgba(255, 203, 107, ${0.14 + intensity * 0.65})`,
                                    border: `1px solid ${
                                      isDiag ? "rgba(255, 107, 107, 0.5)" : "rgba(255, 203, 107, 0.4)"
                                    }`,
                                  }}
                                >
                                  <span className="text-sm font-bold tabular-nums text-foreground">
                                    {val}
                                  </span>
                                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {((val / total) * 100).toFixed(1)}%
                                  </span>
                                </motion.div>
                              );
                            })}
                          </Fragment>
                        ))}
                      </div>
                      <div className="mt-6 text-center text-[10px] font-mono tracking-widest text-muted-foreground">
                        PREDICTED CLASS
                      </div>
                    </div>
                  </div>

                  {/* legend */}
                  <div className="mt-5 flex items-center justify-center gap-5 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm" style={{ background: "rgba(255, 107, 107, 0.6)" }} />
                      Correct
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm" style={{ background: "rgba(255, 203, 107, 0.6)" }} />
                      Confusion
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Per-class analysis */}
          <div className="lg:col-span-2">
            <StaggerGroup className="space-y-3">
              {tumorClasses.map((c, i) => (
                <StaggerItem key={c.name}>
                  <div className="rounded-lg glass p-4 hover:border-coral/40 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-sm" style={{ color: classColors[i] }}>
                        {c.name}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {((rows[i][i] / rows[i].reduce((a, b) => a + b, 0)) * 100).toFixed(1)}% recall
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{c.confusionNote}</p>
                  </div>
                </StaggerItem>
              ))}
              <StaggerItem>
                <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-4">
                  <div className="flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm text-amber-400 mb-1">Key takeaway</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Off-diagonal mass concentrates on Glioma↔Meningioma — a known
                        radiological overlap. Per-class targeted augmentation could close this gap.
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
