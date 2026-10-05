"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/content";
import Badge from "@/components/ui/Badge";
import MagneticButton from "@/components/ui/MagneticButton";
import { Check, Sparkles, Zap, ArrowRight } from "lucide-react";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="relative py-28 sm:py-36 px-4 sm:px-6 md:px-8 bg-[#07070B] overflow-hidden border-t border-white/[0.06]">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-tr from-[#7C5CFF]/15 via-[#FF4D9D]/15 to-transparent rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="violet" className="mb-4">
            <Zap className="w-3.5 h-3.5 text-[#7C5CFF]" />
            <span>{siteConfig.pricing.badge}</span>
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-heading">
            {siteConfig.pricing.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9A9AB0] max-w-xl mx-auto">
            {siteConfig.pricing.description}
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-[#151521] border border-white/10">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !isYearly
                  ? "bg-white/15 text-white shadow"
                  : "text-[#9A9AB0] hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isYearly
                  ? "bg-gradient-to-r from-[#7C5CFF] to-[#FF4D9D] text-white shadow-[0_0_15px_rgba(124,92,255,0.4)]"
                  : "text-[#9A9AB0] hover:text-white"
              }`}
            >
              <span>Annual Rehearsal</span>
              <span className="text-[10px] uppercase font-mono-accent bg-black/40 px-1.5 py-0.5 rounded-full text-[#3DDC97]">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {siteConfig.pricing.tiers.map((tier, idx) => {
            const price = isYearly ? tier.priceYearly : tier.priceMonthly;

            return (
              <div
                key={tier.name}
                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all ${
                  tier.popular
                    ? "bg-[#0E0E16]/95 border-2 border-[#7C5CFF]/70 shadow-[0_0_45px_rgba(124,92,255,0.3)] lg:-translate-y-2"
                    : "bg-[#0E0E16]/75 border border-white/10 hover:border-white/20"
                }`}
              >
                {/* Popular Pill */}
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#7C5CFF] via-[#FF4D9D] to-[#FFB547] text-white text-xs font-bold font-mono-accent uppercase tracking-wider shadow-[0_0_20px_rgba(255,77,157,0.7)]">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white font-heading">{tier.name}</h3>
                    {!tier.popular && (
                      <span className="text-[11px] font-mono-accent text-[#9A9AB0] bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#9A9AB0] leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-white/10">
                    <span className="text-4xl sm:text-5xl font-extrabold font-mono-accent text-white tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs font-mono-accent text-[#9A9AB0]">
                      {price === 0 ? "forever" : "/ month"}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-xs text-[#F5F5FA]">
                        <div className="w-4 h-4 rounded-full bg-[#3DDC97]/20 border border-[#3DDC97]/40 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-[#3DDC97]" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link href="/practice" className="w-full">
                  <MagneticButton
                    variant={tier.popular ? "primary" : "secondary"}
                    size="md"
                    className="w-full py-3 text-xs font-bold"
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </MagneticButton>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
