"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface RadarAxis {
  key: string;
  label: string;
  score: number; // 0 to 10
  max?: number;
}

interface RadarChartProps {
  axes: RadarAxis[];
  size?: number;
  className?: string;
  showLabels?: boolean;
}

export default function RadarChart({
  axes,
  size = 360,
  className = "",
  showLabels = true,
}: RadarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });

  const numAxes = axes.length;
  const center = size / 2;
  const maxRadius = size * 0.38;

  // Compute (x, y) coordinates for a given angle & normalized value (0 to 1)
  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const r = maxRadius * valueRatio;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (maxRadius + 28) * Math.cos(angle),
      labelY: center + (maxRadius + 28) * Math.sin(angle),
    };
  };

  // Concentric polygons (levels 0.25, 0.5, 0.75, 1.0)
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getPolygonPath = (ratio: number) => {
    return (
      axes
        .map((_, i) => {
          const { x, y } = getCoordinates(i, ratio);
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ") + " Z"
    );
  };

  // Data polygon path
  const dataPoints = axes.map((axis, i) => {
    const ratio = Math.min(Math.max(axis.score / (axis.max || 10), 0.1), 1);
    return getCoordinates(i, ratio);
  });

  const dataPathString =
    dataPoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ") + " Z";

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center justify-center select-none", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="radarFillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#FF4D9D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFB547" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="radarStrokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C5CFF" />
            <stop offset="50%" stopColor="#FF4D9D" />
            <stop offset="100%" stopColor="#FFB547" />
          </linearGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Concentric grid rings */}
        {levels.map((level, idx) => (
          <path
            key={idx}
            d={getPolygonPath(level)}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray={idx < 3 ? "3 3" : undefined}
            strokeWidth="1"
          />
        ))}

        {/* Axis spokes radiating from center */}
        {axes.map((_, i) => {
          const { x, y } = getCoordinates(i, 1.0);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Animated Data Polygon */}
        <motion.path
          d={dataPathString}
          fill="url(#radarFillGradient)"
          stroke="url(#radarStrokeGradient)"
          strokeWidth="2.5"
          filter="url(#radarGlow)"
          initial={{ pathLength: 0, opacity: 0, scale: 0.2, transformOrigin: `${center}px ${center}px` }}
          animate={{
            pathLength: isInView ? 1 : 0,
            opacity: isInView ? 1 : 0,
            scale: isInView ? 1 : 0.2,
          }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />

        {/* Glowing Data Vertex Nodes */}
        {dataPoints.map((point, i) => (
          <motion.g
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isInView ? 1 : 0, opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
          >
            <circle cx={point.x} cy={point.y} r="6" fill="#0E0E16" stroke="#FF4D9D" strokeWidth="2" />
            <circle cx={point.x} cy={point.y} r="2.5" fill="#FFFFFF" />
          </motion.g>
        ))}

        {/* Axis Labels */}
        {showLabels &&
          axes.map((axis, i) => {
            const { labelX, labelY } = getCoordinates(i, 1.0);
            return (
              <text
                key={axis.key}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-[#9A9AB0] hover:fill-white text-[11px] font-mono-accent uppercase tracking-wider font-semibold transition-colors"
              >
                {axis.label}
              </text>
            );
          })}
      </svg>
    </div>
  );
}
