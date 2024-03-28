import { create } from 'zustand';

/**
 * This is the global store of the application.
 * It uses Zustand as a store manager and it works
 * like a big store with everything you need inside.
 * The main goal of the store is to save the filters that the user
 * wants when querying (categories).
 */

interface SelectedCategoriesState {
  categoriesList: string[];
  toggleCategory: (cat: string) => void;
  cleanList: () => void;
}

const useStore = create<SelectedCategoriesState>((set) => ({
  categoriesList: [],
  toggleCategory: (cat) =>
    set((state) => {
      const updatedList = state.categoriesList.includes(cat) ? state.categoriesList.filter((category) => category !== cat) : [...state.categoriesList, cat];
      return { categoriesList: updatedList };
    }),
  cleanList: () => set({ categoriesList: [] }),
}));

export default useStore;
