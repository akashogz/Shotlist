import { create } from "zustand";

const INITIAL_FILTERS = {
  sort_by: "Popularity",
  genres: [],
  releaseStart: null,
  releaseEnd: null,
  language: null,
};

export const useUserStore = create((set) => ({
  localFilters: INITIAL_FILTERS,
  
  setLocalFilters: (updater) => 
    set((state) => ({
      localFilters: typeof updater === "function" ? updater(state.localFilters) : updater,
    })),

  activeFilters: [{id: "sort", label: "Popularity"}],
  
  setActiveFilters: (updater) => 
    set((state) => ({
      activeFilters: typeof updater === "function" ? updater(state.activeFilters) : updater,
    })),

  clearAll: () => set({ 
    activeFilters: [{id: "sort", label: "Popularity"}], 
    localFilters: INITIAL_FILTERS 
  }),
}));