"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WaveformProps {
  isActive?: boolean;
  barCount?: number;
  className?: string;
  height?: number;
  colorPreset?: "gradient" | "violet" | "green" | "danger";
}

export default function Waveform({
  isActive = true,
  barCount = 36,
  className = "",
  height = 50,
  colorPreset = "gradient",
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    // Array of base heights to create varied natural speech patterns
    const frequencies = Array.from({ length: barCount }, (_, i) => {
      return 0.2 + 0.8 * Math.sin((i / barCount) * Math.PI);
    });

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      const spacing = 3;
      const barWidth = Math.max(2, (width - spacing * (barCount - 1)) / barCount);

      phase += isActive ? 0.08 : 0.01;

      // Gradient definition
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      if (colorPreset === "gradient") {
        gradient.addColorStop(0, "#7C5CFF");
        gradient.addColorStop(0.5, "#FF4D9D");
        gradient.addColorStop(1, "#FFB547");
      } else if (colorPreset === "green") {
        gradient.addColorStop(0, "#3DDC97");
        gradient.addColorStop(1, "#00FFA3");
      } else if (colorPreset === "danger") {
        gradient.addColorStop(0, "#FF5C6C");
        gradient.addColorStop(1, "#FF4D9D");
      } else {
        gradient.addColorStop(0, "#7C5CFF");
        gradient.addColorStop(1, "#9D7CFF");
      }

      for (let i = 0; i < barCount; i++) {
        // Natural speech modulation combining multiple sines
        const noise = Math.sin(phase * 1.5 + i * 0.4) * 0.35 + Math.cos(phase * 0.8 - i * 0.2) * 0.25;
        const amplitude = isActive
          ? Math.max(0.12, Math.min(1.0, frequencies[i] * (0.4 + noise)))
          : 0.08;

        const currentBarHeight = Math.max(4, amplitude * (h - 6));
        const x = i * (barWidth + spacing);
        const y = (h - currentBarHeight) / 2;

        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Rounded bar
        ctx.roundRect(x, y, barWidth, currentBarHeight, barWidth / 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, barCount, colorPreset]);

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        width={barCount * 8}
        height={height}
        className="w-full h-full block"
      />
    </div>
  );
}
