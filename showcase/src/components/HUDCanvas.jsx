import React, { useEffect, useRef } from 'react';

export default function HUDCanvas({ activeGlowColor = '#00BFFF', isSyncPulse = false, onSyncPulseComplete }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = (canvas.width = window.innerWidth);
      height = (canvas.height = window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Particles System
    const particles = [];
    const maxParticles = 80;
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.5 ? '#00BFFF' : '#8A2BE2',
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    // Binary Rain Streams
    const streams = [];
    const streamCount = Math.floor(width / 60);
    for (let i = 0; i < streamCount; i++) {
      streams.push({
        x: i * 60 + Math.random() * 20,
        y: Math.random() * -height,
        speed: Math.random() * 2 + 1,
        chars: Array.from({ length: 15 }, () => (Math.random() > 0.5 ? '1' : '0')),
        opacity: Math.random() * 0.2 + 0.05,
      });
    }

    // Circuit Pulses
    const circuitPoints = [
      { x: width * 0.2, y: height * 0.2 },
      { x: width * 0.35, y: height * 0.35 },
      { x: width * 0.5, y: height * 0.25 },
      { x: width * 0.65, y: height * 0.35 },
      { x: width * 0.8, y: height * 0.2 },
      { x: width * 0.8, y: height * 0.8 },
      { x: width * 0.5, y: height * 0.7 },
      { x: width * 0.2, y: height * 0.8 },
    ];
    let pulseProgress = 0;

    // Shockwaves (Sync Pulse)
    let shockwaves = [];

    const draw = () => {
      ctx.fillStyle = '#0D1117';
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      // 1. Draw Cyber Grid with Mouse Parallax
      ctx.strokeStyle = 'rgba(0, 191, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSpacing = 40;
      const offsetX = (mouse.x - width / 2) * 0.015;
      const offsetY = (mouse.y - height / 2) * 0.015;

      for (let x = offsetX % gridSpacing; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = offsetY % gridSpacing; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Circuit Lines & Flowing Pulses
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(circuitPoints[0].x, circuitPoints[0].y);
      for (let i = 1; i < circuitPoints.length; i++) {
        ctx.lineTo(circuitPoints[i].x, circuitPoints[i].y);
      }
      ctx.closePath();
      ctx.stroke();

      // Flowing Pulse on Circuit
      pulseProgress += 0.005;
      if (pulseProgress > 1) pulseProgress = 0;
      const totalPoints = circuitPoints.length;
      const currentSegment = Math.floor(pulseProgress * totalPoints);
      const segmentProgress = (pulseProgress * totalPoints) % 1;
      const startPt = circuitPoints[currentSegment % totalPoints];
      const endPt = circuitPoints[(currentSegment + 1) % totalPoints];
      const pulseX = startPt.x + (endPt.x - startPt.x) * segmentProgress;
      const pulseY = startPt.y + (endPt.y - startPt.y) * segmentProgress;

      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00BFFF';
      ctx.fillStyle = '#00BFFF';
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 3. Draw Binary Rain
      ctx.font = '9px monospace';
      streams.forEach((stream) => {
        stream.y += stream.speed;
        if (stream.y > height) {
          stream.y = -150;
          stream.x = Math.random() * width;
        }
        ctx.fillStyle = `rgba(0, 191, 255, ${stream.opacity})`;
        stream.chars.forEach((char, idx) => {
          ctx.fillText(char, stream.x, stream.y + idx * 12);
        });
      });

      // 4. Draw Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 5. Draw Cursor Trail Glow
      ctx.beginPath();
      const radGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
      radGlow.addColorStop(0, 'rgba(0, 191, 255, 0.08)');
      radGlow.addColorStop(0.5, 'rgba(138, 43, 226, 0.03)');
      radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGlow;
      ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
      ctx.fill();

      // 6. Handle Shockwaves (Sync Pulse)
      shockwaves.forEach((sw, idx) => {
        sw.r += sw.speed;
        sw.alpha -= 0.015;
        if (sw.alpha <= 0) {
          shockwaves.splice(idx, 1);
          return;
        }

        ctx.strokeStyle = `rgba(0, 191, 255, ${sw.alpha})`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00BFFF';
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(138, 43, 226, ${sw.alpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Monitor sync pulse triggers
  useEffect(() => {
    if (isSyncPulse) {
      const canvas = canvasRef.current;
      if (canvas) {
        // Trigger massive shockwave from center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const ctx = canvas.getContext('2d');
        
        // Push a new shockwave
        const shockwavesRef = [];
        
        // We simulate pushing shockwave locally inside the animation loop
        // We will mock it by modifying canvasRef instance or window events if needed,
        // or simple canvas properties. Since the loop runs, we can dispatch custom events or write to a global.
        // Even simpler, we can append to window.shockwaves and check it.
        window.shockwaves = window.shockwaves || [];
        window.shockwaves.push({
          x: centerX,
          y: centerY,
          r: 10,
          speed: 8,
          alpha: 1.0,
        });

        // Trigger completing event
        const timer = setTimeout(() => {
          if (onSyncPulseComplete) onSyncPulseComplete();
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isSyncPulse]);

  // Hook local window shockwaves into loop
  useEffect(() => {
    window.shockwaves = [];
    const interval = setInterval(() => {
      // Keep cleaning completed shockwaves
      window.shockwaves = window.shockwaves.filter(sw => {
        sw.r += sw.speed;
        sw.alpha -= 0.015;
        return sw.alpha > 0;
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}
