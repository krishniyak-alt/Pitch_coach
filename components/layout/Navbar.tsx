"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/content";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.stop();
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMobileMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        if (typeof window !== "undefined" && (window as any).__lenis) {
          (window as any).__lenis.start();
        }
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [mobileMenuOpen]);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-50 w-full min-h-16 bg-paper/92 border-b border-rule flex items-center pt-[env(safe-area-inset-top,0px)]">
      <div className="w-full max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Wordmark set in Fraunces (text only, no logo mark) */}
        <Link
          href="/"
          className="font-serif text-2xl font-bold tracking-tight text-ink hover:text-ink-2 transition-colors select-none shrink-0"
        >
          {siteConfig.name}
        </Link>

        {/* Desktop Links (sm and above: exact same layout at 1440x900) */}
        <div className="hidden sm:flex items-center gap-6 sm:gap-8">
          <nav className="flex items-center gap-6 text-sm font-sans font-medium text-ink-2">
            {siteConfig.nav.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="hover:text-ink transition-colors min-h-[44px] flex items-center px-1"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Primary CTA button on the right */}
          <Link
            href="/practice"
            className="btn-signal text-xs sm:text-sm py-2 px-3 sm:px-4 font-semibold shrink-0"
          >
            <span>{siteConfig.hero.primaryCta}</span>
            <span className="arrow-nudge text-xs">→</span>
          </Link>
        </div>

        {/* Mobile controls (< sm): CTA button + Menu Button */}
        <div className="flex sm:hidden items-center gap-3">
          <Link
            href="/practice"
            className="btn-signal text-xs py-2 px-3 font-semibold shrink-0"
          >
            <span>{siteConfig.hero.primaryCta}</span>
            <span className="arrow-nudge text-xs">→</span>
          </Link>

          <button
            ref={menuButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="w-11 h-11 border border-rule bg-paper-2 flex flex-col items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-ink"
            style={{ borderRadius: "2px" }}
          >
            <span
              className={`w-5 h-[1.5px] bg-ink transition-transform duration-200 ${
                mobileMenuOpen ? "rotate-45 translate-y-[4.5px]" : ""
              }`}
            />
            <span
              className={`w-5 h-[1.5px] bg-ink transition-opacity duration-200 ${
                mobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`w-5 h-[1.5px] bg-ink transition-transform duration-200 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Menu Overlay (100dvh, accessible, focus-trapped, same links) */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-paper min-h-[100dvh] flex flex-col justify-between p-6 pt-[calc(1.5rem+env(safe-area-inset-top,0px))] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:hidden border-b border-rule overflow-y-auto overscroll-contain"
        >
          {/* Top Bar with Close Button */}
          <div className="flex items-center justify-between pb-6 border-b border-rule">
            <span className="font-serif text-2xl font-bold tracking-tight text-ink">
              {siteConfig.name}
            </span>
            <button
              onClick={closeMenu}
              aria-label="Close menu"
              className="w-11 h-11 border border-rule bg-paper-2 flex items-center justify-center font-mono text-sm font-bold text-ink"
              style={{ borderRadius: "2px" }}
            >
              ✕
            </button>
          </div>

          {/* Links in exact same order */}
          <nav className="flex flex-col gap-6 py-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-3 font-semibold">
              NAVIGATION
            </span>
            {siteConfig.nav.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className="font-serif text-3xl font-bold text-ink hover:text-ink-2 min-h-[44px] flex items-center border-b border-rule/50 pb-2"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Bottom Actions with exact same CTA button */}
          <div className="pt-6 border-t border-rule space-y-4">
            <Link
              href="/practice"
              onClick={closeMenu}
              className="btn-signal w-full py-4 text-base font-semibold justify-center"
            >
              <span>{siteConfig.hero.primaryCta}</span>
              <span className="arrow-nudge text-base">→</span>
            </Link>
            <div className="text-[11px] font-mono text-ink-3 uppercase text-center tracking-wider">
              {siteConfig.hero.requirementNote}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
