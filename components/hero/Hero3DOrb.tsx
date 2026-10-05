"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingOrb({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Gentle rotation
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.2;

    // React slightly to mouse coordinates
    const targetX = (mouse.current.x * 0.8);
    const targetY = (mouse.current.y * 0.8);
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
  });

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
      <Sphere ref={meshRef} args={[1.55, 64, 64]} scale={1.2}>
        <MeshDistortMaterial
          color="#7C5CFF"
          emissive="#FF4D9D"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          distort={0.42}
          speed={1.8}
          wireframe={false}
        />
      </Sphere>
    </Float>
  );
}

function FloatingParticles() {
  const count = 70;
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  });

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#FFB547"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Hero3DOrb() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [mounted, setMounted] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
      setHasWebGL(gl);
    } catch {
      setHasWebGL(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return <StaticFallbackOrb />;

  if (!hasWebGL) {
    return <StaticFallbackOrb />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-85">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 5]} intensity={1.8} color="#FFB547" />
        <pointLight position={[-5, -4, -2]} intensity={2.5} color="#7C5CFF" />
        <pointLight position={[3, -2, 2]} intensity={2} color="#FF4D9D" />

        <FloatingOrb mouse={mouse} />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}

function StaticFallbackOrb() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
      <div className="relative w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full bg-gradient-to-tr from-[#7C5CFF] via-[#FF4D9D] to-[#FFB547] opacity-40 blur-[90px] animate-pulse-ring" />
    </div>
  );
}
