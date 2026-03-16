import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
}

interface CartStore {
  items: Product[];
  isCartOpen: boolean;
  addItem: (item: Product) => void;
  removeItem: (id: number) => void;
  toggleCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      addItem: (item) => set((state) => ({ 
        items: [...state.items, item],
        isCartOpen: true // E hap shportën automatikisht kur shton produkt
      })),
      removeItem: (id) => set((state) => ({ 
        items: state.items.filter((i) => i.id !== id) 
      })),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      getTotal: () => get().items.reduce((acc, item) => acc + item.price, 0),
    }),
    { name: 'titan-storage' }
  )
);