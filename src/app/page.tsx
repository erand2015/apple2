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

// --- STORE ---
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
  }), { name: 'titan-barrel-white' })
);

const PRODUCTS = [
  { id: 1, name: "Titan 16 Pro", price: 1199, img: "https://images.unsplash.com/photo-1664478546384-d2b076ac3951?q=80&w=1000", tag: "ULTRA POWER" },
  { id: 2, name: "Titan Gaming", price: 1599, img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000", tag: "240HZ OLED" },
  { id: 3, name: "Titan EarX", price: 349, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000", tag: "NOISE CANCEL" },
  { id: 4, name: "Titan Watch", price: 599, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000", tag: "SAPPHIRE" },
  { id: 5, name: "Titan Tab", price: 899, img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000", tag: "M3 CHIP" },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { addItem, items, notification } = useCartStore();
  
  // NAVBAR HIDE/SHOW LOGIC
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);
  });

  // BARREL CAROUSEL LOGIC
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  
  const x = useMotionValue(0);
  const scrollXSpring = useSpring(x, { stiffness: 80, damping: 25 });
  const xVelocity = useVelocity(x);
  
  // Efektet e Barrel: Zgjatja (Scale) dhe Pjerrësia (Skew) gjatë lëvizjes
  const scaleX = useSpring(useTransform(xVelocity, [-2000, 0, 2000], [1.3, 1, 1.3]), { stiffness: 300, damping: 25 });
  const skewX = useSpring(useTransform(xVelocity, [-1500, 1500], [-3, 3]), { stiffness: 150, damping: 25 });
  
  const scrollProgress = useTransform(scrollXSpring, [0, -carouselWidth || -1], ["0%", "100%"]);
  const indicatorThumbX = useTransform(scrollXSpring, [0, -carouselWidth || -1], [0, 280]);

  useLayoutEffect(() => {
    if (mounted) {
      const calc = () => {
        if (trackRef.current && carouselRef.current) {
          setCarouselWidth(trackRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
      };
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
    <main className="bg-white text-black selection:bg-[#CCFF00] selection:text-black antialiased">
      
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[5000] bg-black text-white px-6 py-3 rounded-full font-black text-[10px] uppercase shadow-2xl flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#CCFF00]" /> {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <motion.nav 
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 w-full z-[4000] p-6 md:p-8 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="flex items-center gap-2 font-black italic text-xl tracking-tighter">
          <div className="w-5 h-5 bg-black rounded-sm rotate-45 flex items-center justify-center">
            <Cpu size={12} className="text-[#CCFF00] -rotate-45" />
          </div>
          TITAN<span className="text-gray-400">LAB</span>
        </div>
        <button className="relative w-11 h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
          <ShoppingCart size={18} />
          {items.length > 0 && <span className="absolute -top-1 -right-1 bg-[#CCFF00] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{items.length}</span>}
        </button>
      </motion.nav>

      {/* HERO */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#F9F9FB]">
        <motion.h1 
          initial={{ letterSpacing: "0.1em", opacity: 0 }}
          animate={{ letterSpacing: "-0.05em", opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-[28vw] font-[1000] leading-none italic text-black tracking-tighter select-none"
        >
          CORE
        </motion.h1>
        <p className="text-gray-400 font-black uppercase tracking-[1em] text-[10px] mt-[-2vw]">Engineering Excellence</p>
      </section>

      {/* BARREL SECTION */}
      <section className="py-24 md:py-40 bg-white rounded-t-[3rem] md:rounded-t-[5rem] overflow-hidden">
        <div className="px-8 md:px-10 mb-16 md:mb-24 max-w-[1400px] mx-auto">
          <h2 className="text-5xl md:text-8xl font-black italic uppercase leading-[0.85] tracking-tighter">
            Next-Gen<br/><span className="text-gray-300">Barrel.</span>
          </h2>
        </div>

        <div className="relative">
          {/* Scroll Container with Snapping for Mobile */}
          <div 
            ref={carouselRef} 
            className="overflow-x-auto md:overflow-hidden cursor-grab active:cursor-grabbing px-6 md:px-10 no-scrollbar snap-x snap-mandatory flex"
          >
            <motion.div 
              ref={trackRef} 
              drag="x" 
              dragConstraints={{ right: 0, left: -carouselWidth }} 
              style={{ x: scrollXSpring, skewX }} 
              className="flex gap-4 md:gap-10 w-max pb-20"
            >
              {PRODUCTS.map((p) => (
                <div 
                  key={p.id} 
                  className="w-[85vw] md:w-[450px] h-[550px] md:h-[650px] bg-[#F5F5F7] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 snap-center flex flex-col justify-between shrink-0 group hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-2xl transition-all duration-700"
                >
                  <div className="relative z-10">
                    <span className="text-gray-400 text-[10px] font-black tracking-widest uppercase">{p.tag}</span>
                    <h3 className="text-3xl md:text-5xl font-black italic uppercase mt-2 group-hover:text-black transition-colors">{p.name}</h3>
                  </div>

                  {/* Foto me efekt lëvizjeje brenda kartës */}
                  <motion.div className="relative h-64 md:h-80 flex items-center justify-center">
                    <img 
                      src={p.img} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000 ease-out drop-shadow-2xl" 
                      alt={p.name} 
                    />
                  </motion.div>

                  <div className="flex justify-between items-center border-t border-gray-200 pt-6 md:pt-8 relative z-10">
                    <span className="text-3xl md:text-4xl font-black italic text-black">{p.price}€</span>
                    <button onClick={() => addItem(p)} className="w-14 h-14 md:w-16 md:h-16 bg-black text-white rounded-full flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-all active:scale-90">
                      <ArrowUpRight size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* APPLE-STYLE INDICATOR */}
          <div className="flex flex-col items-center mt-4">
            <div className="relative w-[350px] h-12 flex items-center bg-gray-50 rounded-full border border-gray-100 px-1 shadow-inner">
              <motion.div 
                style={{ x: indicatorThumbX, scaleX }} 
                className="w-16 h-8 bg-black rounded-full flex items-center justify-center z-20 shadow-lg"
              >
                <div className="w-1 h-3 bg-[#CCFF00] rounded-full mx-0.5 opacity-50" />
                <div className="w-1 h-3 bg-[#CCFF00] rounded-full mx-0.5 opacity-50" />
              </motion.div>
              
              {/* Progress Line */}
              <div className="absolute bottom-[-10px] left-0 w-full h-[1px] bg-gray-100">
                <motion.div 
                  style={{ width: scrollProgress }} 
                  className="h-full bg-black" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section className="py-24 px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-[1400px] mx-auto">
        {[
          { i: <Zap />, t: "Turbo Charge", d: "Silicon Anode Tech" },
          { i: <Camera />, t: "Pro Optics", d: "Zeiss Integrated" },
          { i: <BatteryCharging />, t: "Eco Core", d: "Zero Carbon Build" },
          { i: <Smartphone />, t: "Titan Glass", d: "Molecular Bond" }
        ].map((s, idx) => (
          <div key={idx} className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:shadow-xl transition-all group">
            <div className="mb-6 text-gray-300 group-hover:text-black transition-colors">{s.i}</div>
            <h4 className="font-black italic uppercase text-lg text-black">{s.t}</h4>
            <p className="text-[10px] uppercase font-bold text-gray-400">{s.d}</p>
          </div>
        ))}
      </section>

      <footer className="py-32 text-center border-t border-gray-100 bg-[#F9F9FB]">
        <h2 className="text-[15vw] font-black italic text-black opacity-[0.03] select-none leading-none">TITANLAB</h2>
        <p className="text-gray-400 text-[10px] font-black tracking-[0.5em] uppercase">Built for the future</p>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}