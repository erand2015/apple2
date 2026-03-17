'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

// Tip i qartë për çdo telefon (i njëjtë me CartItem në cartStore)
type Phone = {
  id: number;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
};

const phones: Phone[] = [
  // Shto të dhëna testuese këtu – mos e lër bosh!
  {
    id: 1,
    name: "iPhone 17 Pro Max",
    price: 149990,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80",
    isNew: true,
  },
  {
    id: 2,
    name: "Galaxy S26 Ultra",
    price: 129990,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
    isNew: false,
  },
  {
    id: 3,
    name: "Xiaomi 15 Ultra",
    price: 99990,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80",
    isNew: false,
  },
  {
    id: 4,
    name: "Pixel 10 Pro",
    price: 109990,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
    isNew: false,
  },
];

export default function FeaturedPhones() {
  const addToCart = useCartStore((state) => state.addItem);

  return (
    <section className="py-16 px-6 md:px-12 bg-muted/30">
      <h2 className="text-4xl font-bold text-center mb-12">Celularët më të Shitshëm</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {phones.map((phone) => (
          <motion.div
            key={phone.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
          >
            <div className="relative aspect-square">
              <Image
                src={phone.image}
                alt={phone.name}
                fill
                className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
              />
              {phone.isNew && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  E RE
                </span>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">{phone.name}</h3>
              <p className="text-2xl font-bold text-primary">{phone.price.toLocaleString()} Lekë</p>
              <button
                onClick={() => addToCart(phone)}
                className="mt-4 w-full bg-primary text-primary-foreground py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition"
              >
                <ShoppingCart size={20} /> Shto në Shportë
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}