"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Lenis from 'lenis';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useVelocity } from "framer-motion";
import { 
  Hexagon, ShoppingCart, X, ArrowUpRight, Cpu, Zap, Shield, CheckCircle2 
} from "lucide-react";

// --- STORE ---
interface Product { id: number; name: string; price: number; img: string; tag: string; }
interface CartStore {
  items: Product[];
  isCartOpen: boolean;
  notification: string | null;
  addItem: (item: Product) => void;
  removeItem: (id: number) => void;
  toggleCart: () => void;
  getTotal: () => number;
}

const useCartStore = create<CartStore>()(
  persist((set, get) => ({
    items: [], isCartOpen: false, notification: null,
    addItem: (item) => {
      set((state) => ({ items: [...state.items, item], isCartOpen: true, notification: `${item.name} u shtua në shportë!` }));
      setTimeout(() => set({ notification: null }), 3000);
    },
    removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    getTotal: () => get().items.reduce((acc, item) => acc + item.price, 0),
  }), { name: 'titan-vfinal-2026' })
);

const PRODUCTS: Product[] = [
  { id: 1, name: "Titan 16 Pro", price: 1199, img: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000", tag: "LUKSOZ" },
  { id: 2, name: "Titan 16 Ultra", price: 1499, img: "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=1000", tag: "ELITE" },
  { id: 3, name: "Titan 16 Fold", price: 1999, img: "https://images.unsplash.com/photo-1556656793-062ff98782ee?q=80&w=1000", tag: "NEXT-GEN" },
  { id: 4, name: "Titan 16 Air", price: 999, img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1000", tag: "MINIMALIST" },
  { id: 5, name: "Titan Studio", price: 2499, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000", tag: "POWERHOUSE" }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { addItem, toggleCart, items, notification } = useCartStore();
  const { scrollYProgress } = useScroll();
  
  // Carousel States
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  
  // Motion Values
  const x = useMotionValue(0);
  const scrollXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const xVelocity = useVelocity(x);
  const skewX = useSpring(useTransform(xVelocity, [-1500, 1500], [-8, 8]), { stiffness: 150, damping: 25 });

  // Transforms
  const scrollProgress = useTransform(scrollXSpring, [0, -carouselWidth || -1], ["0%", "100%"]);
  const indicatorThumbX = useTransform(scrollXSpring, [0, -carouselWidth || -1], [0, 336]);
  const titanScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.4]);
  const titanOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useLayoutEffect(() => {
    const calculateWidth = () => {
      if (trackRef.current && carouselRef.current) {
        setCarouselWidth(trackRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };
    if (mounted) calculateWidth();
    window.addEventListener("resize", calculateWidth);
    return () => window.removeEventListener("resize", calculateWidth);
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ lerp: 0.08, duration: 1.2 });
      function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);

      // Entrance Reveal for products
      gsap.fromTo(".product-card", 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ".products-section", start: "top 70%" } }
      );

      return () => {
        lenis.destroy();
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }
  }, []);

  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <main className="bg-[#020202] text-white overflow-x-hidden selection:bg-[#00FFFF] selection:text-black">
      {/* NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -100 }} animate={{ y: 40 }} exit={{ y: -100 }} className="fixed top-0 left-1/2 -translate-x-1/2 z-[3000] bg-white text-black px-8 py-4 rounded-full font-black uppercase text-[10px] shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <CheckCircle2 size={16} className="text-green-600 mr-2 inline" /> {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[1000] p-6 md:p-10 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-3 text-2xl font-[1000] italic tracking-tighter uppercase">
          <Hexagon fill="#00FFFF" className="text-[#00FFFF]" size={28} /> TITAN
        </div>
        <button onClick={toggleCart} className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center relative hover:scale-110 transition-transform">
          <ShoppingCart size={22} />
          {items.length > 0 && <span className="absolute -top-1 -right-1 bg-[#00FFFF] text-black text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-black">{items.length}</span>}
        </button>
      </nav>

      {/* HERO SECTION - RIKTHYER */}
      <section className="h-[140vh] flex flex-col items-center justify-center relative bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2500" className="w-full h-full object-cover opacity-30 grayscale" alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>
        
        <motion.div style={{ scale: titanScale, opacity: titanOpacity }} className="text-center z-10">
          <h1 className="text-[22vw] md:text-[26vw] font-[1000] tracking-tighter leading-none italic text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-400 to-zinc-900 select-none">
            TITAN
          </h1>
          <p className="text-[#00FFFF] font-black uppercase tracking-[1.5em] text-[10px] md:text-sm mt-[-2vw] drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
            The Quantum Machine
          </p>
        </motion.div>
      </section>

      {/* SPECS SECTION */}
      <section className="py-20 px-6 md:px-10 max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{ icon: <Cpu />, title: "A20 CHIP" }, { icon: <Zap />, title: "X-CHARGE" }, { icon: <Shield />, title: "G5 TITAN" }].map((spec, i) => (
          <div key={i} className="bg-zinc-950 border border-white/5 p-16 rounded-[4rem] group hover:border-[#00FFFF]/30 transition-all duration-500">
            <div className="text-[#00FFFF] mb-8 group-hover:scale-110 transition-transform">{spec.icon}</div>
            <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">{spec.title}</h3>
          </div>
        ))}
      </section>

      {/* PRODUCTS BARREL SECTION */}
      <section className="products-section py-40 bg-white text-black rounded-t-[5rem] mt-20">
        <div className="max-w-[1800px] mx-auto px-10 mb-24 flex justify-between items-end">
          <h2 className="text-6xl md:text-9xl font-[1000] italic tracking-tighter uppercase leading-[0.85]">
            Koleksioni<br/><span className="text-[#00FFFF]">Titan 16</span>
          </h2>
          <div className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">Drag horizontally</div>
        </div>

        <div className="relative">
          <div ref={carouselRef} className="overflow-hidden cursor-grab active:cursor-grabbing px-10">
            <motion.div 
              ref={trackRef}
              drag="x" 
              dragConstraints={{ right: 0, left: -carouselWidth }}
              style={{ x, skewX }}
              className="flex gap-10 w-max pb-10"
            >
              {PRODUCTS.map((p) => (
                <div key={p.id} className="product-card w-[350px] md:w-[500px] h-[600px] md:h-[750px] bg-zinc-100 rounded-[4rem] p-12 flex flex-col justify-between group hover:bg-black hover:text-white transition-all duration-700 select-none border border-black/5 shadow-xl">
                  <div>
                    <span className="text-[10px] font-black tracking-widest opacity-40 group-hover:text-[#00FFFF] uppercase">{p.tag}</span>
                    <h3 className="text-5xl font-black italic uppercase tracking-tighter mt-4 leading-none">{p.name}</h3>
                  </div>
                  <div className="h-96 w-full overflow-hidden rounded-[2.5rem]">
                    <img src={p.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt="" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-4xl font-black italic tracking-tighter">{p.price}€</span>
                    <button onClick={() => addItem(p)} className="w-20 h-20 bg-black text-white rounded-full group-hover:bg-[#00FFFF] group-hover:text-black transition-all flex items-center justify-center shadow-lg">
                      <ArrowUpRight size={32} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* INDICATORI (GOGLA) ME ANIMACION REVEAL */}
          <div ref={indicatorRef} className="mt-20 flex flex-col items-center gap-6">
            <div className="relative w-full max-w-[400px] h-[2px] bg-zinc-200 rounded-full">
              <motion.div style={{ width: scrollProgress }} className="absolute h-full bg-[#00FFFF] rounded-full" />
            </div>
            <div className="relative w-full max-w-[400px] h-12 flex items-center">
              <div className="absolute inset-0 flex justify-between items-center px-2 opacity-15">
                {[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-black rounded-full" />)}
              </div>
              <motion.div 
                style={{ x: indicatorThumbX }} 
                className="absolute w-16 h-8 bg-black rounded-full flex items-center justify-center shadow-2xl border border-white/5"
              >
                <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-60 text-center bg-[#020202]">
        <h2 className="text-[18vw] font-[1000] italic text-zinc-900 opacity-20 uppercase tracking-tighter select-none">TITAN.</h2>
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.5em] mt-10">© 2026 Designed for the Future</p>
      </footer>
    </main>
  );
}