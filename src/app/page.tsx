"use client";

import React, { useEffect, useRef, useState } from "react";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Lenis from 'lenis';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Hexagon, ShoppingCart, X, ArrowUpRight, Cpu, Activity, Zap, Shield, Globe, Layers, CheckCircle2 
} from "lucide-react";

// --- 1. ZUSTAND STORE ---
interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
  tag?: string;
}

interface CartStore {
  items: Product[];
  isCartOpen: boolean;
  notification: string | null;
  addItem: (item: Product) => void;
  removeItem: (id: number) => void;
  toggleCart: () => void;
  clearNotification: () => void;
  getTotal: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      notification: null,
      addItem: (item) => {
        set((state) => ({ 
          items: [...state.items, item],
          notification: `${item.name} u shtua në shportë!`
        }));
        setTimeout(() => set({ notification: null }), 3000);
      },
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      clearNotification: () => set({ notification: null }),
      getTotal: () => get().items.reduce((acc, item) => acc + item.price, 0),
    }),
    { name: 'titan-storage' }
  )
);

// --- 2. DATA ---
const PRODUCTS: Product[] = [
  { id: 1, name: "Titan 16 Pro", price: 1199, img: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000", tag: "Most Popular" },
  { id: 2, name: "Titan 16 Ultra", price: 1499, img: "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=1000", tag: "Elite Performance" },
  { id: 3, name: "Titan 16 Fold", price: 1999, img: "https://images.unsplash.com/photo-1556656793-062ff98782ee?q=80&w=1000", tag: "Next-Gen" },
  { id: 4, name: "Titan 16 Air", price: 999, img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1000", tag: "Lightweight" }
];

// --- 3. UI COMPONENTS ---
const CartSidebar = () => {
  const { items, isCartOpen, toggleCart, removeItem, getTotal } = useCartStore();
  const subtotal = getTotal();
  const total = subtotal + (subtotal * 0.2);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={toggleCart} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000]" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-[#050505] border-l border-white/5 z-[2001] p-10 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Shporta</h3>
              <button onClick={toggleCart} className="text-white hover:rotate-90 transition-transform"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6">
              {items.map((item, idx) => (
                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={`${item.id}-${idx}`} className="flex gap-4 p-4 bg-white/5 rounded-3xl border border-white/5">
                  <img src={item.img} className="w-16 h-16 object-cover rounded-xl" alt="" />
                  <div className="flex-1 text-xs uppercase font-bold italic text-white">{item.name}<p className="text-[#00FFFF] mt-1 italic font-mono">{item.price}€</p></div>
                  <button onClick={() => removeItem(item.id)} className="text-zinc-500 hover:text-red-500"><X size={16} /></button>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 pt-10 border-t border-white/10">
              <div className="flex justify-between text-2xl font-black italic text-white"><span>TOTAL</span><span className="text-[#00FFFF]">{total.toFixed(2)}€</span></div>
              <button className="w-full bg-[#00FFFF] text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] mt-6">Vazhdo te Pagesa</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- 4. MAIN PAGE ---
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { addItem, toggleCart, items, notification } = useCartStore();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ lerp: 0.08, duration: 1.2 });
      function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);

      gsap.from(".spec-box", {
        scrollTrigger: { trigger: ".specs-section", start: "top 70%" },
        y: 60, opacity: 0, stagger: 0.15, duration: 1, ease: "power4.out"
      });

      return () => lenis.destroy();
    }
  }, []);

  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <main className="bg-[#020202] text-white selection:bg-[#00FFFF] selection:text-black">
      <CartSidebar />
      
      {/* NOTIFICATION POPUP */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="fixed top-10 left-1/2 -translate-x-1/2 z-[3000] bg-white text-black px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(0,255,255,0.3)]">
            <CheckCircle2 size={18} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed top-0 w-full z-[1000] p-8 mix-blend-difference">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center font-black italic uppercase tracking-tighter">
          <div className="flex items-center gap-3 text-xl"><Hexagon className="text-[#00FFFF]" fill="#00FFFF" size={24} /> TITAN</div>
          <button onClick={toggleCart} className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all">
            <ShoppingCart size={18} /> <span>{items.length}</span>
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="text-center z-10">
          <h1 className="text-[25vw] font-black tracking-[-0.08em] leading-none text-white italic">TITAN</h1>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      </section>

      {/* NEW: SPECS SECTION (HYPER-TECH) */}
      <section className="specs-section py-40 px-10 max-w-[1800px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="spec-box bg-zinc-950 border border-white/5 p-12 rounded-[4rem] group hover:border-[#00FFFF]/40 transition-all">
            <Cpu size={40} className="text-[#00FFFF] mb-10 group-hover:scale-110 transition-transform" />
            <h3 className="text-5xl font-black italic tracking-tighter mb-4">A20 BIONIC</h3>
            <p className="text-zinc-500 text-sm font-medium tracking-wide">Procesori më i shpejtë në planet. Arkitekturë 2nm për performancë ekstreme.</p>
          </div>
          <div className="spec-box bg-[#00FFFF] text-black p-12 rounded-[4rem] flex flex-col justify-between">
            <Zap size={40} fill="black" />
            <div className="mt-20">
              <h3 className="text-5xl font-black italic tracking-tighter">10 MIN</h3>
              <p className="font-bold uppercase tracking-widest text-[10px]">Për 100% Karikim</p>
            </div>
          </div>
          <div className="spec-box bg-zinc-950 border border-white/5 p-12 rounded-[4rem] group hover:border-blue-500/40 transition-all">
            <Shield size={40} className="text-blue-500 mb-10 group-hover:rotate-12 transition-transform" />
            <h3 className="text-5xl font-black italic tracking-tighter mb-4">TITANIUM</h3>
            <p className="text-zinc-500 text-sm font-medium tracking-wide">I pathyeshëm. I ndërtuar me materialet e industrisë hapsinore.</p>
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="py-40 px-10 max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="group bg-zinc-900/20 border border-white/5 rounded-[3rem] p-8 hover:bg-zinc-900/40 transition-all">
            <img src={p.img} className="w-full h-80 object-cover rounded-3xl mb-8 grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
            <h3 className="text-3xl font-black italic uppercase mb-2 tracking-tighter">{p.name}</h3>
            <div className="flex justify-between items-center mt-6">
              <span className="text-xl font-mono text-[#00FFFF]">{p.price}€</span>
              <button onClick={() => addItem(p)} className="bg-white text-black px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00FFFF] transition-all">Shto</button>
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center border-t border-white/5">
        <div className="flex justify-center gap-10 mb-10 opacity-30 italic font-black uppercase text-[10px] tracking-[0.5em]">
          <span>Instagram</span> / <span>Twitter</span> / <span>Apple Business</span>
        </div>
        <p className="text-[9px] font-mono text-zinc-600 tracking-[1em]">TITAN Q-LABS // 2026</p>
      </footer>
    </main>
  );
}