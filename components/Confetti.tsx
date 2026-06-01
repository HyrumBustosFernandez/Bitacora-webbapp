'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; color: string;
  rot: number; rotV: number; life: number;
}

const COLORS = ['#5B5BD6', '#818CF8', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];

export default function Confetti({ onDone }: { onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x:    canvas.width  * (0.3 + Math.random() * 0.4),
      y:    canvas.height * 0.4,
      vx:   (Math.random() - 0.5) * 14,
      vy:   -(Math.random() * 12 + 4),
      r:    Math.random() * 5 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot:  Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.3,
      life: 1,
    }));

    let frame: number;
    let done = false;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allDead = true;
      for (const p of particles) {
        if (p.life <= 0) continue;
        allDead = false;
        p.vy += 0.35;
        p.vx *= 0.99;
        p.x  += p.vx;
        p.y  += p.vy;
        p.rot += p.rotV;
        p.life -= 0.012;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();
      }

      if (allDead) {
        if (!done) { done = true; onDone?.(); }
        return;
      }
      frame = requestAnimationFrame(draw);
    }

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        pointerEvents: 'none', width: '100%', height: '100%',
      }}
    />
  );
}
