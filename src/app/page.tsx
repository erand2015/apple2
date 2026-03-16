"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  ShoppingBag, Search, Shield, Zap, Globe, ChevronRight, Menu, X, Cpu, Activity
} from "lucide-react";

export default function TitanEliteExperience() {
  const { scrollY } = useScroll();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Ndjekja e mouse-it për efektin "Glow"
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animacionet e Scroll-it
  const scale = useTransform(scrollY, [0, 500], [1, 1.4]);
  const yText = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const coreGlow = useTransform(scrollY, [0, 500], ["0px 0px 20px #00FFFF", "0px 0px 180px #00FFFF"]);

  return (
    <main className="bg-[#050505] text-white font-sans selection:bg-[#00FFFF] selection:text-black overflow-x-hidden">
      
      {/* 1. Drita që ndjek mouse-in (Cursor Glow) */}
      <div 
        className="pointer-events-none fixed inset-0 z-[400] transition-opacity duration-300 opacity-40"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 255, 0.08), transparent 80%)`
        }}
      />

      {/* 2. NAV */}
      <nav className="fixed top-0 w-full z-[300] mix-blend-difference px-8 py-6 flex justify-between items-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-black tracking-[-0.1em]">TITAN</motion.div>
        <div className="hidden md:flex gap-12 text-[10px] uppercase tracking-[0.4em] font-light">
          {["Vision", "Systems", "Archive", "Access"].map((item) => (
            <a key={item} href="#" className="hover:text-[#00FFFF] transition-colors">{item}</a>
          ))}
        </div>
        <div className="flex gap-6 items-center">
          <Search size={18} strokeWidth={1.5} />
          <ShoppingBag size={18} strokeWidth={1.5} />
        </div>
      </nav>

      {/* 3. HERO SECTION ME "PARALLAX TITAN" */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Shkrimi Parallax */}
        <motion.div style={{ scale, y: yText }} className="relative z-10 flex flex-col items-center">
          <h1 className="text-[25vw] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800 opacity-20 select-none">
            TITAN
          </h1>
        </motion.div>

        {/* Bërthama e Energjisë me Tech Stats anash */}
        <div className="absolute z-20 flex items-center justify-center">
          {/* Stats Majtas */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.4, x: 0 }}
            transition={{ delay: 1 }}
            className="hidden lg:block absolute left-[-200px] text-[10px] font-mono text-[#00FFFF] space-y-2 uppercase"
          >
            <div className="flex items-center gap-2"><Cpu size={12}/> Core: Q-1 Alpha</div>
            <div>Temp: 22.4°C Stable</div>
            <div>Sync: Neural.Link</div>
          </motion.div>

          <motion.div 
            style={{ boxShadow: coreGlow }}
            animate={{ scale: [1, 1.05, 1], rotate: 360 }}
            transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
            className="w-40 h-40 md:w-72 md:h-72 border border-[#00FFFF]/30 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <div className="w-[85%] h-[85%] border border-[#00FFFF]/10 rounded-full animate-ping opacity-20" />
            <div className="absolute w-[1px] h-[150%] bg-gradient-to-t from-transparent via-[#00FFFF]/40 to-transparent rotate-45" />
          </motion.div>

          {/* Stats Djathtas */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.4, x: 0 }}
            transition={{ delay: 1 }}
            className="hidden lg:block absolute right-[-200px] text-[10px] font-mono text-[#00FFFF] space-y-2 uppercase text-right"
          >
            <div className="flex items-center justify-end gap-2">Protocol: 0.8 <Activity size={12}/></div>
            <div>Security: Active</div>
            <div>Location: Tirana, AL</div>
          </motion.div>
        </div>

        <motion.div style={{ opacity }} className="absolute bottom-20 z-30 text-center">
          <p className="text-[#00FFFF] text-[10px] uppercase tracking-[0.6em] mb-4 animate-pulse">Scanning environment...</p>
          <h2 className="text-2xl font-extralight tracking-[0.8em] uppercase text-zinc-400">Quantum Era</h2>
        </motion.div>
      </section>

      {/* 4. EXPERIENTIAL GRID (Mbetet e njëjtë por me hover efekte të shtuara) */}
      <section className="px-4 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-screen mb-4">
        <div className="md:col-span-8 bg-zinc-950 border border-white/5 relative group overflow-hidden h-[60vh] md:h-full">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2000')] bg-cover bg-center opacity-20 grayscale group-hover:scale-110 transition-all duration-[2s]" />
          <div className="relative z-10 p-12 h-full flex flex-col justify-end">
            <span className="text-[#00FFFF] font-mono text-xs mb-4 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity underline">DEVICE_SPECS: 01</span>
            <h3 className="text-5xl font-bold tracking-tighter max-w-md uppercase leading-none">Grade 5<br/>Titanium</h3>
          </div>
        </div>

        <div className="md:col-span-4 bg-[#00FFFF] text-black p-12 flex flex-col justify-between hover:bg-white transition-colors duration-500">
          <div className="space-y-6">
            <Zap size={40} fill="black" />
            <h3 className="text-5xl font-black leading-none uppercase italic tracking-tighter">Ultra<br/>Charge</h3>
          </div>
          <button className="w-full py-4 border-b-2 border-black flex justify-between items-center font-black uppercase tracking-widest text-xs">
            Reserve Yours <ChevronRight size={20} />
          </button>
        </div>

        <div className="md:col-span-4 bg-zinc-900 border border-white/5 p-12 group hover:bg-zinc-800 transition-colors">
          <Globe className="mb-8 opacity-50 group-hover:text-[#00FFFF] group-hover:opacity-100 transition-all" />
          <h4 className="text-xl font-bold mb-4 uppercase tracking-tighter">Global Neural Net</h4>
          <p className="text-zinc-500 text-sm leading-relaxed">Sistemi i parë operativ që mëson dhe përshtatet me ndërgjegjen tuaj në kohë reale.</p>
        </div>

        <div className="md:col-span-8 bg-white text-black p-12 flex items-center justify-between group cursor-pointer overflow-hidden relative">
          <h3 className="text-6xl font-black tracking-tighter uppercase relative z-10 group-hover:skew-x-6 transition-transform">Store Alpha</h3>
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white -rotate-45 group-hover:rotate-0 transition-all duration-500 relative z-10">
            <ChevronRight size={44} />
          </div>
          <div className="absolute bottom-0 left-0 w-0 h-1 bg-black group-hover:w-full transition-all duration-700" />
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-20 px-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-start gap-12 bg-black">
        <div className="space-y-4">
          <div className="text-2xl font-black tracking-tighter">TITAN<span className="text-[#00FFFF]">.</span></div>
          <p className="max-w-xs text-zinc-600 text-[10px] uppercase tracking-widest leading-loose">
            Engineering the impossible from Tiranë, AL. All systems active.
          </p>
        </div>
        
        <div className="flex gap-32">
          <div className="space-y-6">
            <h5 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">Navigation</h5>
            <ul className="text-xs space-y-3 font-bold uppercase tracking-widest">
              <li className="hover:text-[#00FFFF] cursor-pointer">Specs</li>
              <li className="hover:text-[#00FFFF] cursor-pointer">Labs</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">Legal</h5>
            <ul className="text-xs space-y-3 font-bold uppercase tracking-widest">
              <li className="hover:text-[#00FFFF] cursor-pointer">Security</li>
              <li className="hover:text-[#00FFFF] cursor-pointer">Privacy</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Noise Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] contrast-150 grayscale" />
    </main>
  );
}