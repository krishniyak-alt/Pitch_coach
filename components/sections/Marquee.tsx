"use client";

import { siteConfig } from "@/data/content";

export default function Marquee() {
  const logos = [...siteConfig.marqueeLogos, ...siteConfig.marqueeLogos];

  return (
    <section id="marquee" className="relative py-12 overflow-hidden border-y border-white/[0.06] bg-[#0A0A10]/50">
      {/* Edge Fade Gradients */}
      <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#07070B] via-[#07070B]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#07070B] via-[#07070B]/80 to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <p className="text-xs uppercase font-mono-accent tracking-widest text-[#9A9AB0]/70">
          Trusted by competitors from premier global hackathons
        </p>
      </div>

      {/* Marquee Track */}
      <div className="flex select-none group">
        <div className="flex shrink-0 animate-marquee items-center gap-10 sm:gap-16 group-hover:[animation-play-state:paused]">
          {logos.map((logo, index) => (
            <div
              key={`logo-1-${index}`}
              className="flex items-center gap-3.5 px-4 py-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/20 hover:bg-white/[0.06] transition-all cursor-default"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-white text-xs font-mono-accent border border-white/10">
                {logo.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold tracking-tight text-[#F5F5FA] font-heading">
                  {logo.name}
                </span>
                <span className="text-[10px] text-[#9A9AB0] font-mono-accent">
                  {logo.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="flex shrink-0 animate-marquee items-center gap-10 sm:gap-16 group-hover:[animation-play-state:paused]"
        >
          {logos.map((logo, index) => (
            <div
              key={`logo-2-${index}`}
              className="flex items-center gap-3.5 px-4 py-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/20 hover:bg-white/[0.06] transition-all cursor-default"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-white text-xs font-mono-accent border border-white/10">
                {logo.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold tracking-tight text-[#F5F5FA] font-heading">
                  {logo.name}
                </span>
                <span className="text-[10px] text-[#9A9AB0] font-mono-accent">
                  {logo.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
