"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export default function Accordion({ items, className = "" }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={cn(
              "rounded-2xl transition-all duration-300 overflow-hidden border",
              isOpen
                ? "bg-[#151521]/80 border-white/20 shadow-[0_10px_30px_-10px_rgba(124,92,255,0.2)]"
                : "bg-[#0E0E16]/60 border-white/[0.08] hover:border-white/15 hover:bg-[#0E0E16]/80"
            )}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer select-none group"
              aria-expanded={isOpen}
            >
              <span className="text-base sm:text-lg font-semibold font-heading text-white group-hover:text-[#FF4D9D] transition-colors pr-4">
                {item.question}
              </span>
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 shrink-0",
                  isOpen
                    ? "bg-[#7C5CFF]/20 border-[#7C5CFF]/50 text-white rotate-45"
                    : "bg-white/5 border-white/10 text-[#9A9AB0] group-hover:text-white group-hover:border-white/20"
                )}
              >
                <Plus className="w-4 h-4 transition-transform duration-300" />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="px-5 sm:px-6 pb-6 text-sm text-[#9A9AB0] leading-relaxed border-t border-white/5 pt-3">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
