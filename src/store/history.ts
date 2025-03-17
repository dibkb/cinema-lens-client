import { create } from "zustand";

interface Result {
  similar_movies_by_features: { id: number }[];
  similar_movies_by_plot: string[];
}

interface HistoryState {
  homepage: boolean;
  setHomepage: (homepage: boolean) => void;
  tempMessages: string[];
  updateTempMessages: (message: string) => void;
  clearTempMessages: () => void;

  searchHistory: string[];
  updateSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;

  results: Result | null;
  updateResults: (result: Result) => void;
}

const useHistoryStore = create<HistoryState>((set) => ({
  homepage: true,
  setHomepage: (homepage: boolean) => set({ homepage }),
  tempMessages: [],
  updateTempMessages: (message: string) =>
    set((state) => ({ tempMessages: [...state.tempMessages, message] })),
  clearTempMessages: () => set({ tempMessages: [] }),

  searchHistory: [],
  updateSearchHistory: (query: string) =>
    set((state) => ({ searchHistory: [...state.searchHistory, query] })),
  clearSearchHistory: () => set({ searchHistory: [] }),

  results: null,
  updateResults: (result: Result) => set({ results: result }),
}));

export default useHistoryStore;
