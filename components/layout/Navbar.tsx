"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/content";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import { Menu, X, Sparkles, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scrolled styling
      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide on scroll down, show on scroll up
      if (currentScrollY > 200 && currentScrollY > lastScrollY && !mobileMenuOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);

      // Section spy
      const sections = siteConfig.navLinks.map((link) => link.href.replace("#", ""));
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 180) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center py-4 px-4 sm:px-6 md:px-8",
          isVisible ? "translate-y-0" : "-translate-y-28",
          isScrolled ? "py-3" : "py-5"
        )}
      >
        <div
          className={cn(
            "w-full max-w-6xl mx-auto flex items-center justify-between transition-all duration-300 rounded-3xl px-4 sm:px-6 py-2.5",
            isScrolled
              ? "bg-[#0E0E16]/85 backdrop-blur-xl border border-white/10 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8)]"
              : "bg-transparent border border-transparent"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C5CFF] via-[#FF4D9D] to-[#FFB547] p-[1.5px] shadow-[0_0_20px_rgba(124,92,255,0.4)] group-hover:shadow-[0_0_25px_rgba(255,77,157,0.7)] transition-all">
              <div className="w-full h-full bg-[#0E0E16] rounded-xl flex items-center justify-center">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#7C5CFF] to-[#FF4D9D] text-lg font-heading">
                  P
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white font-heading group-hover:text-white transition-colors">
                {siteConfig.name}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#9A9AB0] font-mono-accent -mt-1 hidden sm:block">
                AI Pitch Coach
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#151521]/60 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
            {siteConfig.navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-1.5 text-xs font-medium transition-colors rounded-full",
                    isActive ? "text-white" : "text-[#9A9AB0] hover:text-[#F5F5FA]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-white/10 border border-white/15 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/practice" className="hidden sm:inline-block">
              <span className="text-xs text-[#9A9AB0] hover:text-white px-3 py-1.5 transition-colors font-medium">
                Live Studio
              </span>
            </Link>

            <Link href="/practice">
              <MagneticButton
                variant="primary"
                size="sm"
                className="hidden sm:flex text-xs px-4 py-2 font-medium"
              >
                <span>Start practicing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#07070B]/95 flex flex-col justify-between p-6 pt-24 lg:hidden"
          >
            <div className="flex flex-col gap-4">
              <p className="text-xs font-mono-accent uppercase tracking-widest text-[#7C5CFF]">
                Navigation Menu
              </p>
              <div className="flex flex-col gap-3">
                {siteConfig.navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-2xl font-bold font-heading text-[#F5F5FA] hover:text-[#FF4D9D] transition-colors py-1 block"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="h-[1px] bg-white/10 my-2" />

              <div className="flex flex-col gap-3">
                <Link
                  href="/practice"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-white flex items-center justify-between p-3 rounded-2xl bg-[#151521] border border-white/10"
                >
                  <span>Practice Studio</span>
                  <ArrowRight className="w-4 h-4 text-[#FF4D9D]" />
                </Link>
                <Link
                  href="/results"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-white flex items-center justify-between p-3 rounded-2xl bg-[#151521] border border-white/10"
                >
                  <span>Score & Rubric Results</span>
                  <ArrowRight className="w-4 h-4 text-[#7C5CFF]" />
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-white flex items-center justify-between p-3 rounded-2xl bg-[#151521] border border-white/10"
                >
                  <span>History & Progress</span>
                  <ArrowRight className="w-4 h-4 text-[#FFB547]" />
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <Link href="/practice" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <MagneticButton variant="primary" size="lg" className="w-full">
                  <span>Start Free Rehearsal</span>
                  <Sparkles className="w-4 h-4" />
                </MagneticButton>
              </Link>
              <p className="text-center text-xs text-[#9A9AB0] font-mono-accent">
                Zero credit card needed • Free forever tier
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
