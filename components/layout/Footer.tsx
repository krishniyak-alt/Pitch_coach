"use client";

import Link from "next/link";
import { siteConfig } from "@/data/content";

export default function Footer() {
  return (
    <footer className="w-full bg-paper border-t border-rule py-12 px-5 sm:px-8 lg:px-12 text-ink">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-6">
        {/* Left: Wordmark in Fraunces */}
        <div className="flex items-baseline gap-6">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-tight text-ink hover:text-ink-2 transition-colors select-none"
          >
            {siteConfig.name}
          </Link>

          {/* Center: Three links */}
          <nav className="flex items-center gap-5 text-sm font-sans text-ink-2">
            {siteConfig.footer.links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-ink transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Right: Mono credit line */}
        <div className="font-mono text-xs text-ink-3 tracking-wider uppercase">
          {siteConfig.footer.credits}
        </div>
      </div>
    </footer>
  );
}
