"use client";

import { Brain, Github, FileText, Presentation, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto relative border-t border-teal/15 glass-strong">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="grid place-items-center w-9 h-9 rounded-lg bg-teal/15 border border-teal/40">
                <Brain className="w-5 h-5 text-teal" />
              </span>
              <span className="font-semibold tracking-tight">
                VGG19<span className="text-teal">·</span>MRI
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              An immersive visual case study of fine-tuning VGG19 for 4-class brain tumor
              classification from MRI scans.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Source materials</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { icon: FileText, label: "Jupyter Notebook · 34 pages", href: "#" },
                { icon: Presentation, label: "12-slide technical deck", href: "#" },
                { icon: BookOpen, label: "BT-MRI Dataset (Kaggle)", href: "#" },
              ].map((s) => (
                <li key={s.label}>
                  <span className="flex items-center gap-2.5 text-muted-foreground hover:text-teal transition-colors cursor-default">
                    <s.icon className="w-4 h-4 shrink-0" />
                    {s.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Stack</h4>
            <div className="flex flex-wrap gap-2">
              {["TensorFlow", "Keras", "VGG19", "scikit-learn", "Matplotlib", "Next.js", "Three.js"].map(
                (t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-teal/8 border border-teal/20 text-muted-foreground"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-teal/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            Brain Tumor Classification from MRI Scans · Fine-tuning VGG19 · Clinical ML study.
            For research illustration — not a medical device.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-muted-foreground">
              7,023 scans · 4 classes · 94.75% acc
            </span>
            <Github className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </footer>
  );
}
