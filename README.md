# PitchCoach 🎙️⚡
> **Award-Winning AI Hackathon Pitch Rehearsal Coach**  
> *Rehearse like the judges are already watching.*

A production-quality web application built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **GSAP + ScrollTrigger**, **Lenis**, and **React Three Fiber**.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js 18.x or 20+ (tested on Node v24)
- npm, pnpm, or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Local Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Production Build & Validation
```bash
npm run build
npm run start
```

---

## 🎨 How to Customize Brand Name, Colors, & Copy

### 1. Changing the Brand Name & Site Copy (Single Config File)
All copy, brand names, slogans, judge personas, feature text, pricing tiers, FAQs, and testimonials are centralized in:
👉 [`data/content.ts`](./data/content.ts)

Simply edit the `siteConfig` object:
```ts
export const siteConfig = {
  name: "YourBrand", // Change from "PitchCoach" to whatever you want
  shortName: "YourBrand",
  tagline: "The AI Hackathon Pitch Coach",
  ...
}
```
The entire landing page, navbar, loader, and footer will update automatically.

### 2. Changing Design Colors & Theme Tokens
All color tokens and gradients are defined as CSS variables in:
👉 [`app/globals.css`](./app/globals.css)

```css
:root {
  --bg-base: #07070B;
  --surface: #0E0E16;
  --surface-elevated: #151521;
  --border-subtle: rgba(255, 255, 255, 0.08);
  
  /* Accent Gradient */
  --accent-violet: #7C5CFF;
  --accent-magenta: #FF4D9D;
  --accent-amber: #FFB547;
  
  /* Semantic */
  --success: #3DDC97;
  --warning: #FFB547;
  --danger: #FF5C6C;
}
```

---

## 📂 Project Architecture

```
/
├── app/
│   ├── globals.css           # Design tokens, keyframes, noise overlay, glassmorphism
│   ├── layout.tsx            # Google Fonts (Space Grotesk, Inter, JetBrains Mono), Lenis, Cursor, Loader
│   ├── page.tsx              # Main Landing Page (14 orchestrated sections)
│   ├── practice/page.tsx     # Live Rehearsal Studio (Upload -> Pitch -> Judge Q&A)
│   ├── results/page.tsx      # Comprehensive Rubric & Speech Telemetry Results
│   └── dashboard/page.tsx   # Team Rehearsal History & Progress Tracking
├── components/
│   ├── hero/
│   │   └── Hero3DOrb.tsx     # React Three Fiber 3D gradient orb with static fallback
│   ├── layout/
│   │   ├── Navbar.tsx        # Sticky glass navbar with animated layoutId pill
│   │   ├── Footer.tsx        # Multi-column footer with newsletter & giant wordmark
│   │   ├── SmoothScroll.tsx  # Lenis smooth inertial scrolling synced with GSAP
│   │   ├── CustomCursor.tsx  # Magnetic trailing ring cursor with contextual labels
│   │   ├── ScrollProgress.tsx# Top gradient scroll progress bar
│   │   └── PageLoader.tsx    # 1.6s branded intro preloader & counter
│   ├── sections/
│   │   ├── Hero.tsx          # 3D orb, word-by-word reveal, floating glass cards
│   │   ├── Marquee.tsx       # Infinite hackathon logo marquee with edge fades
│   │   ├── Problem.tsx       # Word-by-word scroll opacity highlight + 3 counters
│   │   ├── HowItWorks.tsx    # Pinned scroll storytelling with device morphing
│   │   ├── FeaturesBento.tsx # 7 interactive micro-cards, 3D tilt & cursor spotlight
│   │   ├── InteractiveDemo.tsx # Browser frame: slide viewer, waveform recorder, timer, judge questions
│   │   ├── ScoringRubric.tsx # 5-axis animated SVG radar chart & score bars
│   │   ├── JudgesShowcase.tsx# Horizontal pinned scroll with 4 AI Judge personas
│   │   ├── Testimonials.tsx  # Dual-row opposite auto-scrolling marquee
│   │   ├── Pricing.tsx       # Monthly/Yearly toggle with animated pricing
│   │   ├── FAQ.tsx           # Smooth expandable accordion with rotating plus icons
│   │   └── FinalCTA.tsx      # Full-width gradient mesh with confetti burst
│   └── ui/
│       ├── MagneticButton.tsx# Spring pull cursor magnetism
│       ├── GlowCard.tsx      # 3D tilt (max 6deg) & cursor spotlight radial light
│       ├── Counter.tsx       # Eased numeric count-up component
│       ├── ScoreRing.tsx     # SVG radial score gauge with animated stroke
│       ├── RadarChart.tsx    # 5-axis animated SVG radar chart with stroke-dashoffset
│       ├── Waveform.tsx      # Canvas real-time audio waveform (no heavy libs)
│       ├── Badge.tsx         # Glowing pill badge
│       └── Accordion.tsx     # Smooth height animated FAQ accordion
├── data/
│   ├── content.ts            # Centralized site copy, brand name, and section items
│   └── mock.ts               # Rehearsal slides, rubric radar scores, judge Q&A, history
└── lib/
    ├── animations.ts         # Framer motion variants and easing curves
    └── utils.ts              # cn helper, time formatters
```

---

## 🛠️ Technology Stack & Libraries

- **Framework**: Next.js 14+ (App Router) with React 19 & TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Inertial Scrolling**: `@studio-freight/lenis` / `lenis`
- **Scroll Timelines & Pinning**: GSAP + ScrollTrigger
- **Component Motion**: Framer Motion
- **3D / WebGL Hero**: `@react-three/fiber` + `@react-three/drei` + `three` (with static CSS fallback)
- **Audio Visuals**: High-performance HTML5 Canvas wave frequency renderer
- **Icons**: `lucide-react`
- **Typography**: Google Fonts via `next/font/google` (`Space_Grotesk`, `Inter`, `JetBrains_Mono`)
- **Effects**: `canvas-confetti`

---

## 📋 Assumptions Made

1. **Client-Side Simulation**: Voice recording, slide OCR/parsing, and judge Q&A responses are simulated on the client with interactive states, timers, and animations, making the site runnable out of the box with zero external API keys or backends required.
2. **Graceful WebGL Fallback**: If hardware acceleration or WebGL is disabled in the client's environment, the 3D Hero Orb automatically falls back to an animated CSS gradient mesh orb to ensure 60fps performance and zero layout shift.
3. **Reduced Motion**: Respects `prefers-reduced-motion` media queries by dampening heavy parallax and cursor transforms.
