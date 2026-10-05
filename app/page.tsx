import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Problem from "@/components/sections/Problem";
import HowItWorks from "@/components/sections/HowItWorks";
import FeaturesBento from "@/components/sections/FeaturesBento";
import InteractiveDemo from "@/components/sections/InteractiveDemo";
import ScoringRubric from "@/components/sections/ScoringRubric";
import JudgesShowcase from "@/components/sections/JudgesShowcase";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <main className="relative bg-[#07070B] min-h-screen text-[#F5F5FA] overflow-x-hidden selection:bg-[#7C5CFF]/30">
      {/* Sticky Glass Navbar */}
      <Navbar />

      {/* Hero with 3D Orb and Parallax */}
      <Hero />

      {/* Infinite Hackathon Logo Marquee */}
      <Marquee />

      {/* The Problem Section */}
      <Problem />

      {/* How It Works: Pinned Scroll Storytelling */}
      <HowItWorks />

      {/* Features Bento Grid with Micro-Animations */}
      <FeaturesBento />

      {/* Interactive Live Demo */}
      <InteractiveDemo />

      {/* Scoring Rubric with SVG Radar Chart */}
      <ScoringRubric />

      {/* AI Judge Personas: Horizontal Scroll */}
      <JudgesShowcase />

      {/* Social Proof Testimonials */}
      <Testimonials />

      {/* Pricing Tiers */}
      <Pricing />

      {/* FAQ Accordion */}
      <FAQ />

      {/* Final Stage Ready CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
