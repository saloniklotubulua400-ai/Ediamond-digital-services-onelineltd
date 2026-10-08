'use client';
import { useEffect, useRef } from 'react';

const GLYPHS = ['{ }', '</>', '01', 'AI', '=>', '()', '#', '10'];

export default function HeroTech() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, raf = 0, nodes = [];
    let running = true, onScreen = true;
    const pointer = { x: 0, y: 0, active: false };

    const build = () => {
      const count = Math.round(Math.min(70, Math.max(22, (w * h) / 16000)));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.4 + Math.random() * 1.6,
        g: i % 6 === 0 ? GLYPHS[(i / 6) % GLYPHS.length | 0] : null,
      }));
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      draw();
    };

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const maxD = w < 760 ? 95 : 140;

      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < maxD) {
            ctx.strokeStyle = `rgba(41,198,255,${(1 - d / maxD) * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.font = '600 12px ui-monospace, Menlo, Consolas, monospace';
      for (const n of nodes) {
        if (n.g) {
          ctx.fillStyle = 'rgba(130,190,255,0.38)';
          ctx.fillText(n.g, n.x, n.y);
        } else {
          ctx.fillStyle = 'rgba(41,198,255,0.85)';
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
        if (pointer.active) {
          const d = Math.hypot(n.x - pointer.x, n.y - pointer.y);
          if (d < 170) {
            ctx.strokeStyle = `rgba(91,140,255,${(1 - d / 170) * 0.6})`;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }
    }

    const loop = () => {
      if (running && onScreen) draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };
    const onVis = () => { running = !document.hidden; };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; });
    io.observe(host);

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVis);

    resize();
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="hero-fx" aria-hidden="true" />;
}