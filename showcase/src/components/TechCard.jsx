import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function TechCard({ name, category, icon, animationType, delay = 0, isSyncing = false }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [awakened, setAwakened] = useState(false);

  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 250, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 250, damping: 25 });

  // Sequential materialization timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setAwakened(true);
    }, delay * 1000 + 200);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Normalize values between -0.5 and 0.5
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  // Specific custom animation decorations based on tech type
  const renderCardDetails = () => {
    if (!hovered) return null;
    
    switch (animationType) {
      case 'html':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            {/* Orbiting fiery particles */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-orange-500 rounded-full animate-ping -translate-x-12 -translate-y-12 shadow-[0_0_10px_#f06529]" />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-orange-600 rounded-full animate-ping translate-x-12 translate-y-12 shadow-[0_0_10px_#f06529] delay-75" />
          </div>
        );
      case 'css':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg opacity-40">
            {/* Liquid neon waves */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-cyan-500 to-transparent animate-pulse" />
            <div className="absolute -bottom-2 -left-10 -right-10 h-6 bg-cyan-400 opacity-30 blur-md rounded-full animate-bounce" />
          </div>
        );
      case 'javascript':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg opacity-60">
            {/* Electric pulses */}
            <div className="absolute top-2 left-4 w-[2px] h-6 bg-yellow-400 shadow-[0_0_8px_#f7df1e] animate-pulse" />
            <div className="absolute bottom-2 right-4 w-[2px] h-6 bg-yellow-400 shadow-[0_0_8px_#f7df1e] animate-pulse delay-100" />
          </div>
        );
      case 'typescript':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            {/* Vertical scanline */}
            <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#3178c6] to-transparent shadow-[0_0_8px_#3178c6] absolute animate-bounce" style={{ animationDuration: '2.5s' }} />
          </div>
        );
      case 'python':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            {/* Dual color streams */}
            <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-blue-400 via-yellow-400 to-transparent shadow-[0_0_10px_#3776ab]" />
            <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-gradient-to-t from-blue-400 via-yellow-400 to-transparent shadow-[0_0_10px_#3776ab]" />
          </div>
        );
      case 'nodejs':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg font-mono text-[6px] text-green-500 opacity-25 leading-none px-2 pt-2">
            {/* Falling matrix code */}
            <div>101011</div>
            <div>011001</div>
            <div>110110</div>
            <div>001011</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative w-full aspect-square md:aspect-video rounded-xl bg-gradient-to-br from-cyber-gray to-[#0D1117] border-2 transition-all duration-300 ${
        isSyncing
          ? 'border-cyber-blue glow-active scale-105'
          : hovered
          ? 'border-cyber-blue shadow-[0_0_20px_rgba(0,191,255,0.4)]'
          : 'border-cyber-purple/20'
      } ${awakened ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} cursor-pointer overflow-hidden group`}
    >
      {/* 1. Cinematic volumetric overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/5 to-purple-500/5 opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* 2. Cyber grid detail on card back */}
      <div className="absolute inset-0 bg-cyber-grid opacity-15" />

      {/* 3. Tech Awakening Scanline (renders once during initialization) */}
      {!awakened && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-blue to-transparent h-1 w-full animate-pulse top-0" />
      )}

      {/* 4. Rotating energy corner brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyber-blue opacity-50 group-hover:opacity-100" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyber-purple opacity-50 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyber-purple opacity-50 group-hover:opacity-100" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyber-blue opacity-50 group-hover:opacity-100" />

      {/* 5. Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 translate-z-10">
        {/* Holographic Glowing Badge Circle */}
        <div className={`p-3 rounded-full bg-cyber-bg/80 border border-cyber-purple/30 group-hover:border-cyber-blue/60 transition-all duration-300 ${hovered ? 'scale-110 shadow-[0_0_12px_rgba(0,191,255,0.3)]' : ''}`}>
          {icon}
        </div>
        <span className="mt-3 text-xs md:text-sm font-semibold tracking-wider text-slate-300 group-hover:text-cyber-blue transition-colors">
          {name}
        </span>
        <span className="text-[9px] uppercase tracking-widest text-slate-500 mt-1">
          {category}
        </span>
      </div>

      {/* 6. Unique animated features */}
      {renderCardDetails()}

      {/* 7. Holographic Glow trail overlay */}
      {hovered && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),_#00BFFF_0%,_transparent_50%)]"
          style={{
            '--x': `${(x.get() + 0.5) * 100}%`,
            '--y': `${(y.get() + 0.5) * 100}%`,
          }}
        />
      )}
    </motion.div>
  );
}
