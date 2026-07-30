"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X } from "lucide-react";
import { navItems } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "glass-strong border-b border-coral/15" : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => handleClick("overview")}
          className="flex items-center gap-2.5 group"
        >
          <span className="relative grid place-items-center w-9 h-9 rounded-lg bg-coral/15 border border-coral/40">
            <Brain className="w-5 h-5 text-coral" />
          </span>
          <span className="font-semibold tracking-tight">
            VGG19<span className="text-coral">·</span>MRI
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n.id)}
              className={cn(
                "relative px-3 py-1.5 text-sm rounded-md transition-colors",
                active === n.id
                  ? "text-coral"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {n.label}
              {active === n.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-md bg-coral/10 border border-coral/30"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <button
          className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden glass-strong border-b border-coral/15"
          >
            <div className="px-4 py-3 grid grid-cols-2 gap-1">
              {navItems.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n.id)}
                  className={cn(
                    "px-3 py-2 text-sm text-left rounded-md",
                    active === n.id
                      ? "text-coral bg-coral/10"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
