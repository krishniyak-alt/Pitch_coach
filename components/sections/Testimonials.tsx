"use client";

import { siteConfig } from "@/data/content";
import Badge from "@/components/ui/Badge";
import { Star, Trophy, Sparkles } from "lucide-react";

export default function Testimonials() {
  const testimonials = siteConfig.testimonials;
  const row1 = [...testimonials, ...testimonials];
  const row2 = [...testimonials.slice(2), ...testimonials.slice(0, 2), ...testimonials];

  return (
    <section id="testimonials" className="relative py-28 sm:py-36 bg-[#07070B] overflow-hidden border-t border-white/[0.06]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#7C5CFF]/10 via-[#FFB547]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 px-4">
        <Badge variant="amber" className="mb-4">
          <Trophy className="w-3.5 h-3.5 text-[#FFB547]" />
          <span>Proof from the Stage</span>
        </Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-heading">
          Backed by hackathon champions
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#9A9AB0] max-w-xl mx-auto">
          Over 2,000 teams refined their delivery, dodged devastating questions, and walked away with prize cheques.
        </p>
      </div>

      {/* Dual Row Opposite Infinite Scrolling Marquee */}
      <div className="flex flex-col gap-6 relative">
        {/* Edge Fade Gradients */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#07070B] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#07070B] to-transparent z-10 pointer-events-none" />

        {/* Row 1: Forward Marquee */}
        <div className="flex select-none group overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-6 group-hover:[animation-play-state:paused]">
            {row1.map((item, index) => (
              <TestimonialCard key={`r1-${index}`} item={item} />
            ))}
          </div>
          <div aria-hidden="true" className="flex shrink-0 animate-marquee items-center gap-6 group-hover:[animation-play-state:paused]">
            {row1.map((item, index) => (
              <TestimonialCard key={`r1-dup-${index}`} item={item} />
            ))}
          </div>
        </div>

        {/* Row 2: Reverse Marquee */}
        <div className="flex select-none group overflow-hidden">
          <div className="flex shrink-0 animate-marquee-reverse items-center gap-6 group-hover:[animation-play-state:paused]">
            {row2.map((item, index) => (
              <TestimonialCard key={`r2-${index}`} item={item} />
            ))}
          </div>
          <div aria-hidden="true" className="flex shrink-0 animate-marquee-reverse items-center gap-6 group-hover:[animation-play-state:paused]">
            {row2.map((item, index) => (
              <TestimonialCard key={`r2-dup-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item }: { item: any }) {
  return (
    <div className="w-[320px] sm:w-[380px] p-6 rounded-3xl bg-[#0E0E16]/85 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div>
        {/* Star Rating & Score */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-[#FFB547]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#FFB547]" />
            ))}
          </div>
          <span className="text-xs font-mono-accent text-[#3DDC97] bg-[#3DDC97]/15 px-2 py-0.5 rounded-full border border-[#3DDC97]/30">
            {item.score}
          </span>
        </div>

        {/* Quote */}
        <p className="text-xs sm:text-sm text-[#F5F5FA] leading-relaxed italic">
          “{item.quote}”
        </p>
      </div>

      {/* Author info */}
      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#FF4D9D] flex items-center justify-center font-bold text-white text-xs font-mono-accent border border-white/20">
          {item.avatar}
        </div>
        <div>
          <div className="text-sm font-bold text-white font-heading">{item.name}</div>
          <div className="text-xs text-[#FFB547] font-mono-accent">{item.event}</div>
        </div>
      </div>
    </div>
  );
}
