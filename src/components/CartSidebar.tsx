"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export const CartSidebar = () => {
  const { items, isCartOpen, toggleCart, removeItem, getTotal } = useCartStore();
  const subtotal = getTotal();
  const tax = subtotal * 0.20;
  const total = subtotal + tax;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
          />
          
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-zinc-950 border-l border-white/5 z-[1001] p-10 flex flex-col"
          >
            {/* ... pjesa tjeter e kodit me layout motion.div ... */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};