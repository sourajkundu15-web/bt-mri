"use client";

import { motion } from "framer-motion";
import { SectionHeading, CountUp } from "./primitives";
import { trainingConfig, callbacks, trainCode, history, finalMetrics } from "@/lib/site-data";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { Cog, Download, Gauge } from "lucide-react";

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl glass p-5">
      <div className="mb-3">
        <h4 className="font-semibold text-sm">{title}</h4>
        {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="h-56">{children}</div>
    </div>
  );
}

const tooltipStyle = {
  background: "rgba(44, 52, 96, 0.95)",
  border: "1px solid rgba(100, 112, 180, 0.5)",
  borderRadius: "8px",
  fontSize: "12px",
};

export function Training() {
  const accData = history.map((h) => ({
    epoch: h.epoch,
    Train: +(h.train_acc * 100).toFixed(2),
    Validation: +(h.val_acc * 100).toFixed(2),
  }));
  const lossData = history.map((h) => ({
    epoch: h.epoch,
    Train: +h.train_loss.toFixed(3),
    Validation: +h.val_loss.toFixed(3),
  }));
  const aucData = history.map((h) => ({
    epoch: h.epoch,
    Train: +(h.val_auc * 100).toFixed(2),
    Validation: +(h.val_auc * 100).toFixed(2),
    Precision: +(h.val_prec * 100).toFixed(2),
    Recall: +(h.val_rec * 100).toFixed(2),
  }));

  return (
    <section id="training" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          index="05 · TRAINING"
          kicker="Training Configuration"
          title="Resumable, multi-metric training over 100 epochs"
          description="Four metrics are logged per epoch — accuracy, precision, recall and AUC — and the full history is persisted to disk after every epoch so training can resume without losing curves."
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Config grid */}
          <div className="lg:col-span-1 section-reveal">
            <div className="rounded-xl glass p-5">
              <div className="flex items-center gap-2 mb-4">
                <Cog className="w-4 h-4 text-coral" />
                <h3 className="font-semibold text-sm">Configuration</h3>
              </div>
              <dl className="space-y-2.5">
                {trainingConfig.map((c) => (
                  <div key={c.label} className="flex items-center justify-between text-sm">
                    <dt className="text-muted-foreground">{c.label}</dt>
                    <dd className="font-mono text-foreground">{c.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-4 rounded-xl glass p-5">
              <div className="flex items-center gap-2 mb-4">
                <Download className="w-4 h-4 text-amber" />
                <h3 className="font-semibold text-sm">Callbacks</h3>
              </div>
              <div className="space-y-3">
                {callbacks.map((c) => (
                  <div key={c.name} className="text-sm">
                    <div className="font-mono text-coral">{c.name}</div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Code */}
          <div className="lg:col-span-2 section-reveal">
            <div className="rounded-xl overflow-hidden glass-strong h-full">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-coral/15 bg-coral/5">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber/60" />
                </div>
                <span className="font-mono text-xs text-muted-foreground ml-2">train.py</span>
              </div>
              <pre className="p-4 sm:p-5 overflow-x-auto text-[11.5px] leading-relaxed font-mono max-h-[420px]">
                <code>
                  {trainCode.split("\n").map((line, i) => (
                    <div key={i} className="whitespace-pre">
                      <span className="text-muted-foreground/40 select-none mr-4 inline-block w-6 text-right">
                        {i + 1}
                      </span>
                      <span
                        className={
                          line.trim().startsWith("#") || line.trim().startsWith("def")
                            ? "text-muted-foreground/70"
                            : "text-foreground"
                        }
                      >
                        {line || " "}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <Gauge className="w-4 h-4 text-coral" />
            <span className="font-mono text-xs tracking-widest text-muted-foreground">
              TRAINING CURVES · 100 EPOCHS
            </span>
            <span className="h-px flex-1 bg-coral/20" />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <ChartCard
              title="Accuracy"
              subtitle="Validation plateaus near 95%; train saturates to 1.0 after ~epoch 60"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 112, 180, 0.35)" />
                  <XAxis
                    dataKey="epoch"
                    stroke="#a0a6c4"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#a0a6c4"
                    fontSize={11}
                    domain={[50, 100]}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line
                    type="monotone"
                    dataKey="Train"
                    stroke="#89ddff"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Validation"
                    stroke="#ff6b6b"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Loss"
              subtitle="Val loss settles around 0.19; small upticks hint at mild overfitting"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lossData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 112, 180, 0.35)" />
                  <XAxis
                    dataKey="epoch"
                    stroke="#a0a6c4"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#a0a6c4"
                    fontSize={11}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line
                    type="monotone"
                    dataKey="Train"
                    stroke="#89ddff"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Validation"
                    stroke="#ff6b6b"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Precision · Recall · AUC"
              subtitle="All three metrics climb past 94% by the final epoch"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aucData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gAuc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gPrec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffcb6b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ffcb6b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 112, 180, 0.35)" />
                  <XAxis
                    dataKey="epoch"
                    stroke="#a0a6c4"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#a0a6c4"
                    fontSize={11}
                    domain={[80, 100]}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area
                    type="monotone"
                    dataKey="Precision"
                    stroke="#ffcb6b"
                    strokeWidth={2}
                    fill="url(#gPrec)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Recall"
                    stroke="#89ddff"
                    strokeWidth={2}
                    fill="none"
                  />
                  <Area
                    type="monotone"
                    dataKey="Train"
                    stroke="#ff6b6b"
                    strokeWidth={2}
                    fill="url(#gAuc)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Validation AUC"
              subtitle="Macro-averaged, 4-class — reaches 0.991, excellent separability"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aucData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gAucFull" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 112, 180, 0.35)" />
                  <XAxis
                    dataKey="epoch"
                    stroke="#a0a6c4"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#a0a6c4"
                    fontSize={11}
                    domain={[80, 100]}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="Train"
                    stroke="#ff6b6b"
                    strokeWidth={2.5}
                    fill="url(#gAucFull)"
                    name="Val AUC"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Quick stats strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 section-reveal">
          {[
            { label: "Final val accuracy", value: 94.75, suffix: "%", color: "#ff6b6b" },
            { label: "Final val AUC", value: 99.11, suffix: "%", color: "#ffcb6b" },
            { label: "Val precision", value: 94.81, suffix: "%", color: "#89ddff" },
            { label: "Val recall", value: 94.69, suffix: "%", color: "#c792ea" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg glass p-4 text-center">
              <div className="text-2xl font-bold tabular-nums" style={{ color: s.color }}>
                <CountUp to={s.value} decimals={2} suffix={s.suffix} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
