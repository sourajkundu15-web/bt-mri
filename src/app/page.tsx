"use client";

import { useReveal } from "@/hooks/use-reveal";
import { NavBar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { NeuralVision } from "@/components/sections/neural-vision";
import { Problem } from "@/components/sections/problem";
import { Dataset } from "@/components/sections/dataset";
import { Pipeline } from "@/components/sections/pipeline";
import { Architecture } from "@/components/sections/architecture";
import { Training } from "@/components/sections/training";
import { Evaluation } from "@/components/sections/evaluation";
import { Results } from "@/components/sections/results";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  useReveal();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Hero />
        <NeuralVision />
        <Problem />
        <Dataset />
        <Pipeline />
        <Architecture />
        <Training />
        <Evaluation />
        <Results />
      </main>
      <Footer />
    </div>
  );
}
