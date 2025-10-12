import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Supplier, Order, ScoringModel, ClientSite, Filters } from './types';

interface AppState {
  suppliers: Supplier[];
  orders: Order[];
  scoringModels: ScoringModel[];
  clientSites: ClientSite[];
  filters: Filters;
  activeModelId: string | null;
  
  setSuppliers: (suppliers: Supplier[]) => void;
  setOrders: (orders: Order[]) => void;
  setScoringModels: (models: ScoringModel[]) => void;
  setClientSites: (sites: ClientSite[]) => void;
  setActiveModelId: (id: string | null) => void;
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
      scoringModels: [],
      clientSites: [],
      filters: defaultFilters,
      activeModelId: null,
      
      setSuppliers: (suppliers) => set({ suppliers }),
      setOrders: (orders) => set({ orders }),
      setScoringModels: (models) => set({ scoringModels: models }),
      setClientSites: (sites) => set({ clientSites: sites }),
      setActiveModelId: (id) => set({ activeModelId: id }),
      updateFilters: (newFilters) => 
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: 'synergic-nexum-storage',
    }
  )
);
