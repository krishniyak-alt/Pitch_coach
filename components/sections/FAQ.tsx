"use client";

import { siteConfig } from "@/data/content";
import Badge from "@/components/ui/Badge";
import Accordion from "@/components/ui/Accordion";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  return (
    <section id="faq" className="relative py-28 sm:py-36 px-4 sm:px-6 md:px-8 bg-[#07070B] overflow-hidden border-t border-white/[0.06]">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#7C5CFF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="violet" className="mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#7C5CFF]" />
            <span>Got Questions?</span>
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-heading">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base text-[#9A9AB0]">
            Everything you need to know about preparing your deck, acoustic privacy, and winning on Sunday.
          </p>
        </div>

        {/* Accordion */}
        <Accordion items={siteConfig.faq} />
      </div>
    </section>
  );
}
