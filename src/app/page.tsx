"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Lenis from 'lenis';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useVelocity, useMotionValueEvent } from "framer-motion";
import { 
  ShoppingCart, ArrowUpRight, CheckCircle2, Zap, Camera, BatteryCharging, Smartphone, Cpu 
} from "lucide-react";

// --- 1. STORE (ZUSTAND) ---
interface Product { id: number; name: string; price: number; img: string; tag: string; }
interface CartStore {
  items: Product[];
  notification: string | null;
  addItem: (item: Product) => void;
}

const useCartStore = create<CartStore>()(
  persist((set) => ({
    items: [], notification: null,
    addItem: (item) => {
      set((state) => ({ items: [...state.items, item], notification: `${item.name} u shtua!` }));
      setTimeout(() => set({ notification: null }), 3000);
    },
  }), { name: 'titan-final-v1' })
);

const PRODUCTS = [
  { id: 1, name: "Titan 16 Pro", price: 1199, img: "https://images.unsplash.com/photo-1664478546384-d2b076ac3951?q=80&w=1000", tag: "ULTRA POWER" },
  { id: 2, name: "Titan Gaming", price: 1599, img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000", tag: "240HZ OLED" },
  { id: 3, name: "Titan EarX", price: 349, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000", tag: "NOISE CANCEL" },
  { id: 4, name: "Titan Watch", price: 599, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000", tag: "SAPPHIRE" },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { addItem, items, notification } = useCartStore();
  
  // LOGJIKA E NAVBAR-IT (Hide on Scroll)
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true); // Scroll poshtë -> Fshihet
    } else {
      setHidden(false); // Scroll lart -> Shfaqet
    }
  });

  // Carousel Logic
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const x = useMotionValue(0);
  const scrollXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const xVelocity = useVelocity(x);
  const scaleX = useSpring(useTransform(xVelocity, [-2000, 0, 2000], [1.5, 1, 1.5]), { stiffness: 400, damping: 30 });

  const scrollProgress = useTransform(scrollXSpring, [0, -carouselWidth || -1], ["0%", "100%"]);
  const indicatorThumbX = useTransform(scrollXSpring, [0, -carouselWidth || -1], [0, 280]);

  useLayoutEffect(() => {
    if (mounted) {
      const calc = () => trackRef.current && carouselRef.current && setCarouselWidth(trackRef.current.scrollWidth - carouselRef.current.offsetWidth);
      calc(); window.addEventListener("resize", calc);
      return () => window.removeEventListener("resize", calc);
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ lerp: 0.1 });
      function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      return () => lenis.destroy();
    }
  }, []);

  if (!mounted) return null;

  return (
    <main className="bg-[#020202] text-white selection:bg-[#CCFF00] selection:text-black">
      
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[5000] bg-[#CCFF00] text-black px-6 py-3 rounded-full font-black text-[10px] uppercase shadow-[0_0_30px_#CCFF00]">
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SMART NAVBAR --- */}
      <motion.nav 
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 w-full z-[4000] p-6 md:p-8 flex justify-between items-center bg-black/60 backdrop-blur-xl border-b border-white/5"
      >
        <div className="flex items-center gap-2 font-black italic text-xl tracking-tighter">
          <div className="w-6 h-6 bg-[#CCFF00] rounded-sm rotate-45 flex items-center justify-center">
            <Cpu size={14} className="text-black -rotate-45" />
          </div>
          TITAN<span className="text-[#CCFF00]">LAB</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest hover:text-[#CCFF00] transition-colors">Store</button>
          <button className="hidden md:block text-[10px] font-bold uppercase tracking-widest hover:text-[#CCFF00] transition-colors">Compare</button>
          <button className="relative w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-all">
            <ShoppingCart size={18} />
            {items.length > 0 && <span className="absolute -top-1 -right-1 bg-[#CCFF00] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{items.length}</span>}
          </button>
        </div>
      </motion.nav>

      {/* HERO */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#CCFF0012_0%,_transparent_60%)]" />
        <motion.h1 
          initial={{ letterSpacing: "0.5em", opacity: 0 }}
          animate={{ letterSpacing: "-0.05em", opacity: 1 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="text-[28vw] font-[1000] leading-none italic text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800"
        >
          CORE
        </motion.h1>
        <p className="text-[#CCFF00] font-black uppercase tracking-[1em] text-[10px] mt-[-2vw]">Engineering Tomorrow</p>
      </section>

      {/* PRODUCT SECTION */}
      <section className="py-40 bg-zinc-950 rounded-t-[5rem] border-t border-white/5">
        <div className="px-10 mb-24 max-w-[1400px] mx-auto">
          <h2 className="text-8xl font-black italic uppercase leading-[0.85] tracking-tighter">
            Digital<br/><span className="text-[#CCFF00]">Supremacy.</span>
          </h2>
        </div>

        <div className="relative">
          <div ref={carouselRef} className="overflow-hidden cursor-grab active:cursor-grabbing px-10">
            <motion.div ref={trackRef} drag="x" dragConstraints={{ right: 0, left: -carouselWidth }} style={{ x: scrollXSpring }} className="flex gap-10 w-max pb-24">
              {PRODUCTS.map((p) => (
                <div key={p.id} className="w-[450px] h-[650px] bg-[#050505] rounded-[3.5rem] p-12 border border-white/5 group hover:border-[#CCFF00]/30 transition-all duration-700 flex flex-col justify-between overflow-hidden shadow-2xl">
                  <div>
                    <span className="text-[#CCFF00] text-[10px] font-black tracking-widest opacity-70 group-hover:opacity-100">{p.tag}</span>
                    <h3 className="text-5xl font-black italic uppercase mt-2 group-hover:text-[#CCFF00] transition-colors">{p.name}</h3>
                  </div>

                  <img src={p.img} className="w-full h-72 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110 drop-shadow-[0_0_30px_rgba(204,255,0,0.1)]" alt="" />

                  <div className="flex justify-between items-center border-t border-white/5 pt-8">
                    <span className="text-4xl font-black italic">{p.price}€</span>
                    <button onClick={() => addItem(p)} className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center group-hover:bg-[#CCFF00] transition-all transform active:scale-90">
                      <ArrowUpRight size={28} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* INDICATOR */}
          <div className="flex flex-col items-center">
            <div className="relative w-[350px] h-12 flex items-center bg-white/5 rounded-full border border-white/10">
              <motion.div 
                style={{ x: indicatorThumbX, scaleX }} 
                className="w-16 h-8 bg-[#CCFF00] rounded-full flex items-center justify-center shadow-[0_0_20px_#CCFF0040] z-20"
              >
                <div className="w-1 h-3 bg-black/20 rounded-full mx-0.5" />
                <div className="w-1 h-3 bg-black/20 rounded-full mx-0.5" />
              </motion.div>
            </div>
            <div className="w-[350px] h-[1px] bg-white/10 mt-6 relative">
              <motion.div style={{ width: scrollProgress }} className="absolute h-full bg-[#CCFF00] shadow-[0_0_15px_#CCFF00]" />
            </div>
          </div>
        </div>
      </section>

      {/* TECH SPECS */}
      <section className="py-40 px-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[1400px] mx-auto bg-black">
        {[
          { i: <Zap />, t: "Turbo Charge", d: "Silicon Anode Tech" },
          { i: <Camera />, t: "Pro Optics", d: "Zeiss Integrated" },
          { i: <BatteryCharging />, t: "Eco Core", d: "Zero Carbon Build" },
          { i: <Smartphone />, t: "Titan Glass", d: "Molecular Bond" }
        ].map((s, idx) => (
          <div key={idx} className="p-10 border border-white/5 bg-zinc-950 rounded-[2rem] hover:bg-[#CCFF00] hover:text-black transition-all group">
            <div className="mb-6 text-[#CCFF00] group-hover:text-black transition-colors">{s.i}</div>
            <h4 className="font-black italic uppercase text-lg">{s.t}</h4>
            <p className="text-[10px] uppercase font-bold opacity-40 group-hover:opacity-100">{s.d}</p>
          </div>
        ))}
      </section>

      <footer className="py-20 text-center border-t border-white/5 bg-[#020202]">
        <h2 className="text-[10vw] font-black italic opacity-5 select-none">TITANLAB</h2>
        <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.5em] mt-4">© 2026 Designed for high performance</p>
      </footer>
    </main>
  );
}