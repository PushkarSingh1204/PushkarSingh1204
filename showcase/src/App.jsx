import React, { useState, useEffect, useRef } from 'react';
import HUDCanvas from './components/HUDCanvas';
import TechCard from './components/TechCard';
import { 
  Code2, Flame, Layers, Zap, Cpu, Compass, Settings, Database, 
  Terminal, ShieldCheck, RefreshCw, LogOut, Disc, MessageSquareCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [inactivityTimer, setInactivityTimer] = useState(0);
  const [isSyncPulse, setIsSyncPulse] = useState(false);
  const [logs, setLogs] = useState(['[SYSTEM] BOOTING COGNITIVE HUD v1.2.0...']);
  const [systemState, setSystemState] = useState('STANDBY');
  const [cardPulseSync, setCardPulseSync] = useState(false);

  // Tech stack definitions matching the original list
  const techStack = [
    { name: 'HTML5', category: 'Language', animationType: 'html', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M3 2L21 2L19 18L12 22L5 18L3 2Z" fill="#E34F26" />
        <path d="M12 4L12 20L17.5 17L19 4Z" fill="#F06529" />
      </svg>
    )},
    { name: 'CSS3', category: 'Language', animationType: 'css', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M3 2L21 2L19 18L12 22L5 18L3 2Z" fill="#1572B6" />
        <path d="M12 4L12 20L17.5 17L19 4Z" fill="#29ABE2" />
      </svg>
    )},
    { name: 'JavaScript', category: 'Language', animationType: 'javascript', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <text x="12" y="16" fill="black" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">JS</text>
      </svg>
    )},
    { name: 'TypeScript', category: 'Language', animationType: 'typescript', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <text x="12" y="16" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">TS</text>
      </svg>
    )},
    { name: 'Python', category: 'Language', animationType: 'python', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="9" r="6" fill="#3776AB" />
        <circle cx="15" cy="15" r="6" fill="#FFE052" />
      </svg>
    )},
    { name: 'Node.js', category: 'Runtime', animationType: 'nodejs', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <polygon points="4,7 12,2 20,7 20,17 12,22 4,17" fill="#339933" />
      </svg>
    )},
    { name: 'Next.js', category: 'Framework', animationType: 'nextjs', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="black" stroke="white" strokeWidth="1.5" />
        <text x="12" y="16" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">N</text>
      </svg>
    )},
    { name: 'Framer Motion', category: 'Library', animationType: 'framer', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <polygon points="2,2 22,2 12,12" fill="#0055FF" />
        <polygon points="12,12 22,22 2,22" fill="#FF00C8" />
      </svg>
    )},
    { name: 'TensorFlow', category: 'AI/ML', animationType: 'tensorflow', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <polygon points="4,7 12,2 20,7 20,17 12,22 4,17" fill="#FF6F00" />
      </svg>
    )},
    { name: 'Firebase', category: 'Database', animationType: 'firebase', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M4 20 L12 2 L20 20 L12 22 Z" fill="#FFCA28" />
      </svg>
    )},
    { name: 'Arduino', category: 'IoT/HW', animationType: 'arduino', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="12" r="5" fill="none" stroke="#00979D" strokeWidth="2" />
        <circle cx="16" cy="12" r="5" fill="none" stroke="#00979D" strokeWidth="2" />
      </svg>
    )},
    { name: 'Raspberry Pi', category: 'IoT/HW', animationType: 'raspberrypi', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="14" r="7" fill="#C51A4A" />
        <path d="M9 6 Q12 10 15 6" fill="none" stroke="#228B22" strokeWidth="2" />
      </svg>
    )},
    { name: 'Git', category: 'VCS', animationType: 'git', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="6" r="3" fill="none" stroke="#F05032" strokeWidth="2" />
        <circle cx="12" cy="18" r="3" fill="none" stroke="#F05032" strokeWidth="2" />
        <path d="M12 9 L12 15" stroke="#F05032" strokeWidth="2" />
        <path d="M12 12 Q19 12 20 12" stroke="#F05032" strokeWidth="2" fill="none" />
      </svg>
    )},
    { name: 'GitHub', category: 'VCS', animationType: 'github', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="white" />
        <path d="M8 8 L7 10 M16 8 L17 10" stroke="black" strokeWidth="1.5" />
      </svg>
    )},
    { name: 'Figma', category: 'Design', animationType: 'figma', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="6" r="4" fill="#F24E1E" />
        <circle cx="16" cy="6" r="4" fill="#A259FF" />
        <circle cx="8" cy="14" r="4" fill="#0ACF83" />
        <circle cx="16" cy="14" r="4" fill="#1ABC9C" />
      </svg>
    )},
    { name: 'Postman', category: 'API Tool', animationType: 'postman', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M6 20 L12 4 L18 20 Z" fill="#FF6C37" />
      </svg>
    )},
    { name: 'Notion', category: 'Productivity', animationType: 'notion', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="3" fill="white" stroke="black" strokeWidth="2" />
        <text x="12" y="16" fill="black" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">N</text>
      </svg>
    )},
    { name: 'Canva', category: 'Design', animationType: 'canva', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="#00C4CC" />
      </svg>
    )},
    { name: 'Illustrator', category: 'Design', animationType: 'illustrator', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="3" fill="#330000" stroke="#FF9A00" strokeWidth="2" />
        <text x="12" y="16" fill="#FF9A00" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Ai</text>
      </svg>
    )},
  ];

  // Inactivity tracking (10s sync pulse trigger)
  useEffect(() => {
    const resetTimer = () => {
      setInactivityTimer(0);
    };
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    const interval = setInterval(() => {
      setInactivityTimer((prev) => {
        if (prev >= 10) {
          triggerMassiveSyncPulse();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearInterval(interval);
    };
  }, []);

  // Simulating terminal log readouts
  useEffect(() => {
    const bootSequence = [
      '⚡ [SYS_INIT] Loading tech modules...',
      '🔍 [ANALYSIS] Scanning Arduino & Raspberry Pi hardware...',
      '📦 [MODULE] Mounting Next.js and Framer Motion layout...',
      '🔥 [SYSTEM] PATENTED AI MONITORING DETECTED: Focus Aura Core active.',
      '🚀 [ONLINE] COGNITIVE CORE LOADED SUCCESSFULLY. Welcome Pushkar.',
    ];
    bootSequence.forEach((msg, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev.slice(-8), msg]);
        if (idx === bootSequence.length - 1) setSystemState('SECURE');
      }, (idx + 1) * 800);
    });
  }, []);

  const triggerMassiveSyncPulse = () => {
    setIsSyncPulse(true);
    setCardPulseSync(true);
    setLogs((prev) => [...prev.slice(-8), '💥 [WARNING] MASSIVE REACTOR CORE SYNC PULSE RELEASED!']);
    
    // Confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00BFFF', '#8A2BE2', '#ffffff'],
    });

    setTimeout(() => {
      setCardPulseSync(false);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0D1117] text-white flex flex-col font-mono overflow-hidden">
      {/* 1. Interactive 3D Canvas Background */}
      <HUDCanvas isSyncPulse={isSyncPulse} onSyncPulseComplete={() => setIsSyncPulse(false)} />

      {/* 2. Top HUD Telemetry Panel */}
      <header className="w-full border-b border-cyber-purple/20 bg-cyber-bg/80 backdrop-blur-md px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-blue"></span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-slate-300">PUSHKAR_SINGH // PORTFOLIO HUD</h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest">Core Status: {systemState}</p>
          </div>
        </div>

        {/* Back to main profile */}
        <a 
          href="https://github.com/PushkarSingh1204"
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-cyber-blue/30 bg-cyber-blue/5 hover:bg-cyber-blue/20 hover:border-cyber-blue transition-all duration-300 group text-xs text-cyber-blue"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>EXIT TO PROFILE</span>
        </a>
      </header>

      {/* 3. Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 z-10">
        
        {/* Left Column: Diagnostics, Logs & Patent Spotlight */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Reactor telemetry diagnostics console */}
          <div className="border border-cyber-purple/20 bg-cyber-bg/50 backdrop-blur-md p-4 rounded-xl flex flex-col gap-4">
            <h3 className="text-xs font-bold text-cyber-blue tracking-widest uppercase border-b border-cyber-blue/20 pb-2 flex items-center justify-between">
              <span>CORE_DIAGNOSTICS</span>
              <Terminal className="w-3.5 h-3.5" />
            </h3>
            <div className="text-[10px] text-slate-400 flex flex-col gap-2 leading-relaxed">
              <div className="flex justify-between border-b border-cyber-gray pb-1">
                <span>ACTIVE_CORE:</span>
                <span className="text-cyber-blue">JARVIS_REACTOR_V3</span>
              </div>
              <div className="flex justify-between border-b border-cyber-gray pb-1">
                <span>Uptime:</span>
                <span className="text-slate-300">100% ONLINE</span>
              </div>
              <div className="flex justify-between border-b border-cyber-gray pb-1">
                <span>Patent Count:</span>
                <span className="text-yellow-400">1 (Focus Aura)</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Inactivity Pulse:</span>
                <span className="text-cyber-purple">{10 - inactivityTimer}s</span>
              </div>
            </div>
            
            <button 
              onClick={triggerMassiveSyncPulse}
              className="w-full mt-2 py-2 text-xs font-bold border border-cyber-purple hover:border-cyber-blue bg-cyber-purple/10 hover:bg-cyber-blue/10 rounded transition-all duration-300 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>EMIT ENERGY PULSE</span>
            </button>
          </div>

          {/* Live system logs */}
          <div className="flex-1 border border-cyber-purple/20 bg-cyber-bg/50 backdrop-blur-md p-4 rounded-xl flex flex-col min-h-[180px]">
            <h3 className="text-xs font-bold text-cyber-blue tracking-widest uppercase border-b border-cyber-blue/20 pb-2">
              TELEMETRY_LOGS
            </h3>
            <div className="flex-1 overflow-y-auto font-mono text-[9px] text-green-400 mt-2 flex flex-col gap-1.5 scrollbar-thin">
              {logs.map((log, idx) => (
                <div key={idx} className="opacity-90 animate-fade-in">{log}</div>
              ))}
            </div>
          </div>

        </section>

        {/* Center / Right Columns: Responsive animated card grid */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-cyber-blue/20 pb-2">
            <h2 className="text-lg font-bold text-cyber-blue tracking-widest flex items-center gap-2">
              <MessageSquareCode className="w-5 h-5" />
              <span>COGNITIVE_MODULES</span>
            </h2>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">{techStack.length} MODULES STABLE</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
            {techStack.map((tech, index) => (
              <TechCard 
                key={tech.name} 
                name={tech.name} 
                category={tech.category}
                animationType={tech.animationType}
                icon={tech.icon}
                delay={index * 0.08}
                isSyncing={cardPulseSync}
              />
            ))}
          </div>
        </section>

      </main>

      {/* 4. Footer HUD Dashboard Bar */}
      <footer className="w-full border-t border-cyber-purple/20 bg-cyber-bg/80 backdrop-blur-md px-6 py-3 flex items-center justify-between z-20 text-[9px] text-slate-500 uppercase tracking-widest">
        <span>SECURITY_KEY: PUSHKAR_SINGH_SECURE_AUTH</span>
        <span>© 2026 Pushkar Singh. System fully operational.</span>
      </footer>
    </div>
  );
}
