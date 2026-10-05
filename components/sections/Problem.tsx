"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/data/content";
import Counter from "@/components/ui/Counter";
import Badge from "@/components/ui/Badge";
import { AlertTriangle, Clock, Flame } from "lucide-react";

export default function Problem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.4"],
  });

  const statementWords = siteConfig.problem.statement.split(" ");

  return (
    <section
      id="problem"
      ref={containerRef}
      className="relative py-28 sm:py-36 px-4 sm:px-6 md:px-8 bg-[#07070B] overflow-hidden"
    >
      {/* Background Stage Light Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF4D9D]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Section Badge */}
        <Badge variant="magenta" className="mb-6">
          <AlertTriangle className="w-3.5 h-3.5 text-[#FF4D9D]" />
          <span>{siteConfig.problem.badge}</span>
        </Badge>

        {/* Word-by-Word Scroll Highlight Statement */}
        <div className="text-center my-6 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.25] font-heading flex flex-wrap justify-center gap-x-2.5 sm:gap-x-3.5 gap-y-1">
            {statementWords.map((word, i) => {
              // Word progress threshold
              const start = i / statementWords.length;
              const end = start + 1 / statementWords.length;
              return (
                <WordHighlight
                  key={i}
                  word={word}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </h2>
        </div>

        {/* 3 Stat Counters with Bento Glass Cards */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {siteConfig.problem.stats.map((stat, idx) => {
            const icons = [
              <Clock key="1" className="w-5 h-5 text-[#FF5C6C]" />,
              <Flame key="2" className="w-5 h-5 text-[#FFB547]" />,
              <AlertTriangle key="3" className="w-5 h-5 text-[#7C5CFF]" />,
            ];

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-3xl bg-[#0E0E16]/80 backdrop-blur-xl border border-white/[0.08] p-7 flex flex-col justify-between group hover:border-white/20 transition-all shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
              >
                {/* Subtle top rim light */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                    {icons[idx]}
                  </div>
                  <span className="text-[11px] font-mono-accent text-[#9A9AB0] uppercase tracking-wider">
                    Stat 0{idx + 1}
                  </span>
                </div>

                <div>
                  <div className="text-4xl sm:text-5xl font-extrabold font-mono-accent text-white tracking-tight flex items-baseline">
                    <Counter
                      value={stat.value}
                      duration={2.2}
                      className="font-bold"
                    />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D9D] to-[#FFB547] ml-1">
                      {stat.suffix}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-3 font-heading">
                    {stat.label}
                  </h3>
                  <p className="text-xs text-[#9A9AB0] mt-1.5 leading-relaxed">
                    {stat.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WordHighlight({
  word,
  progress,
  range,
}: {
  word: string;
  progress: any;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  const color = useTransform(progress, range, ["#9A9AB0", "#FFFFFF"]);

  // Highlight key words like 'sleepless', '4 minutes', 'die' with subtle accent
  const isSpecial = ["36", "sleepless", "4", "minutes", "run", "out", "die"].some(k =>
    word.toLowerCase().includes(k)
  );

  return (
    <motion.span
      style={{ opacity, color }}
      className={`transition-colors duration-200 ${
        isSpecial ? "font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D9D] to-[#FFB547]" : ""
      }`}
    >
      {word}
    </motion.span>
  );
}
