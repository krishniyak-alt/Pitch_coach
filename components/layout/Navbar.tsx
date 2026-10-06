"use client";

import Link from "next/link";
import { siteConfig } from "@/data/content";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-paper/92 border-b border-rule flex items-center">
      <div className="w-full max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Wordmark set in Fraunces (text only, no logo mark) */}
        <Link
          href="/"
          className="font-serif text-2xl font-bold tracking-tight text-ink hover:text-ink-2 transition-colors select-none"
        >
          {siteConfig.name}
        </Link>

        {/* Center/Right Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <nav className="hidden sm:flex items-center gap-6 text-sm font-sans font-medium text-ink-2">
            {siteConfig.nav.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="hover:text-ink transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* One small primary button on the right: "Run your pitch" */}
          <Link
            href="/practice"
            className="btn-signal text-xs sm:text-sm py-2 px-3 sm:px-4 font-semibold"
          >
            <span>{siteConfig.hero.primaryCta}</span>
            <span className="arrow-nudge text-xs">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
