import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Supplier, Order, InventoryRecord, Payment, ConsumerEvent, Filters } from './types';

interface AppState {
  suppliers: Supplier[];
  orders: Order[];
  inventory: InventoryRecord[];
  payments: Payment[];
  consumerEvents: ConsumerEvent[];
  filters: Filters;
  
  setSuppliers: (suppliers: Supplier[]) => void;
  setOrders: (orders: Order[]) => void;
  setInventory: (inventory: InventoryRecord[]) => void;
  setPayments: (payments: Payment[]) => void;
  setConsumerEvents: (events: ConsumerEvent[]) => void;
  updateFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
}

const defaultFilters: Filters = {
  dateRange: '30d',
  channel: 'all',
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      suppliers: [],
      orders: [],
      inventory: [],
      payments: [],
      consumerEvents: [],
      filters: defaultFilters,
      
      setSuppliers: (suppliers) => set({ suppliers }),
      setOrders: (orders) => set({ orders }),
      setInventory: (inventory) => set({ inventory }),
      setPayments: (payments) => set({ payments }),
      setConsumerEvents: (events) => set({ consumerEvents: events }),
      updateFilters: (newFilters) => 
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: 'synergic-nexum-storage',
    }
  )
);
