"use client";

import { motion } from "framer-motion";
import { SectionHeading, StaggerGroup, StaggerItem, CountUp } from "./primitives";
import { datasetStats, tumorClasses } from "@/lib/site-data";
import { Database } from "lucide-react";

function Donut() {
  const total = datasetStats.splits.reduce((a, b) => a + b.count, 0);
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const colors = ["#ff6b6b", "#ffcb6b", "#89ddff"];

  // Pre-compute cumulative offsets purely (no mutation during render).
  const segments = datasetStats.splits.reduce<
    { len: number; offset: number; color: string; name: string }[]
  >((acc, s, i) => {
    const len = (s.count / total) * circ;
    const offset = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].len : 0;
    acc.push({ len, offset, color: colors[i], name: s.name });
    return acc;
  }, []);

  return (
    <div className="relative grid place-items-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
        {segments.map((seg, i) => (
          <motion.circle
            key={seg.name}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth="22"
            strokeDasharray={`${seg.len} ${circ - seg.len}`}
            strokeDashoffset={-seg.offset}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
          />
        ))}
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-bold text-gradient-coral">
          <CountUp to={datasetStats.total} decimals={0} />
        </div>
        <div className="text-[11px] text-muted-foreground font-mono tracking-widest mt-1">
          TOTAL SCANS
        </div>
      </div>
    </div>
  );
}

export function Dataset() {
  return (
    <section id="dataset" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          index="02 · DATA"
          kicker="Dataset Overview"
          title="7,023 T1-weighted MRI scans, four classes"
          description="The BT-MRI Dataset provides pre-split train / validation / test directories. ImageDataGenerator rescales pixels to [0,1]; no augmentation in this run."
        />

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Donut + split stats */}
          <div className="section-reveal rounded-xl glass p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <Donut />
              <div className="flex-1 w-full space-y-4">
                {datasetStats.splits.map((s, i) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{ background: ["#ff6b6b", "#ffcb6b", "#89ddff"][i] }}
                        />
                        {s.name}
                      </span>
                      <span className="font-mono text-muted-foreground">
                        {s.count.toLocaleString()} · {s.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: ["#ff6b6b", "#ffcb6b", "#89ddff"][i] }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 mt-4 border-t border-coral/15 grid grid-cols-3 gap-3 text-center">
                  {[
                    { l: "Classes", v: 4 },
                    { l: "Img size", v: "224²" },
                    { l: "Batch", v: 100 },
                  ].map((x) => (
                    <div key={x.l}>
                      <div className="text-lg font-bold text-coral tabular-nums">{x.v}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {x.l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dataset meta */}
          <div className="section-reveal space-y-4">
            <div className="rounded-xl glass p-6">
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-5 h-5 text-coral" />
                <h3 className="font-semibold">BT-MRI Dataset</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A curated collection of 7,023 T1-weighted contrast MRI slices across four
                diagnostic categories. Splits are as provided by the dataset author — no
                re-shuffling was performed to keep results comparable.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg glass p-4">
                <div className="text-2xl font-bold text-coral">
                  <CountUp to={4512} decimals={0} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">Training images</div>
              </div>
              <div className="rounded-lg glass p-4">
                <div className="text-2xl font-bold text-amber">
                  <CountUp to={1600} decimals={0} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">Validation images</div>
              </div>
            </div>
          </div>
        </div>

        {/* Class gallery with MRI images */}
        <div id="classes" className="mt-12 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px flex-1 bg-coral/20" />
            <span className="font-mono text-xs tracking-widest text-muted-foreground">
              FOUR TARGET CLASSES
            </span>
            <span className="h-px flex-1 bg-coral/20" />
          </div>
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tumorClasses.map((c) => (
              <StaggerItem key={c.name}>
                <div className="group rounded-xl overflow-hidden glass hover:border-coral/50 transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={c.image}
                      alt={`${c.name} MRI scan`}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    {/* scan line */}
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-coral/20 to-transparent animate-scan-line pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <div className="text-lg font-bold leading-tight" style={{ color: c.accent }}>
                          {c.name}
                        </div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          {c.tag}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">{c.description}</p>
                    <p className="text-[11px] text-muted-foreground/70 leading-relaxed mt-2 pt-2 border-t border-coral/10">
                      {c.detail}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
