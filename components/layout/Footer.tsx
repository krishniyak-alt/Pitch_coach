"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/content";
import { ArrowRight, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail("");
      setSubmitted(false);
    }, 3000);
  };

  return (
    <footer className="relative bg-[#050508] border-t border-white/10 pt-20 pb-12 px-4 sm:px-6 md:px-8 overflow-hidden select-none">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/[0.08]">
          {/* Col 1: Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C5CFF] via-[#FF4D9D] to-[#FFB547] p-[1.5px]">
                  <div className="w-full h-full bg-[#0E0E16] rounded-xl flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#7C5CFF] to-[#FF4D9D]">
                    P
                  </div>
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-heading">
                  {siteConfig.name}
                </span>
              </Link>
              <p className="mt-4 text-xs sm:text-sm text-[#9A9AB0] leading-relaxed max-w-sm">
                The premier AI rehearsal coach built specifically for hackathon competitors and early stage technical founders.
              </p>
            </div>

            {/* Social icons with inline SVGs */}
            <div className="flex items-center gap-3 mt-6">
              {[
                {
                  label: "Twitter/X",
                  svg: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                  href: "#",
                },
                {
                  label: "GitHub",
                  svg: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                    </svg>
                  ),
                  href: "#",
                },
                {
                  label: "Discord",
                  svg: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  ),
                  href: "#",
                },
              ].map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#9A9AB0] hover:text-white hover:border-[#7C5CFF] hover:bg-[#7C5CFF]/15 transition-all"
                  aria-label={s.label}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Product Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono-accent uppercase tracking-widest text-white font-bold mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9A9AB0]">
              <li>
                <Link href="/practice" className="hover:text-white transition-colors">
                  Live Studio
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-white transition-colors">
                  Rubric Scoring
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Progression Dashboard
                </Link>
              </li>
              <li>
                <a href="#judges" className="hover:text-white transition-colors">
                  AI Judge Personas
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono-accent uppercase tracking-widest text-white font-bold mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9A9AB0]">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-white transition-colors">
                  Interactive Demo
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  MLH Rubric Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Winning Pitch Deck Formula
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-mono-accent uppercase tracking-widest text-white font-bold mb-2">
              Sunday Pitch Intelligence
            </h4>
            <p className="text-xs text-[#9A9AB0] mb-4">
              Get winning hackathon breakdown notes and secret questions asked by top YC & ETHGlobal judges.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your hacker email..."
                  required
                  className="w-full bg-[#151521] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-[#9A9AB0]/50 focus:outline-none focus:border-[#7C5CFF] pr-28 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#FF4D9D] text-white text-xs font-medium hover:brightness-110 transition-all flex items-center gap-1"
                >
                  {submitted ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Joined!</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Credits & Giant Wordmark */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9A9AB0] font-mono-accent">
          <div>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Built for hackathon teams worldwide</span>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>

        {/* Giant Faded Wordmark */}
        <div className="mt-12 text-center pointer-events-none select-none overflow-hidden">
          <span className="text-[14vw] font-extrabold uppercase font-heading tracking-tighter text-white/[0.025] leading-none block">
            {siteConfig.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
