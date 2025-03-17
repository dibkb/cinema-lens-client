import { create } from "zustand";

interface Result {
  similar_movies_by_features: { id: number }[];
  similar_movies_by_plot: string[];
}

export interface Movie {
  actors: string[];
  director: string[];
  genres: string[];
  id: number;
  poster_url: string;
  release_date: string;
  title: string;
  plot: string;
  rating: number;
  year: number;
}
interface SearchHistory {
  query: string;
  related_movies: Movie[] | null;
  similar_movies: Movie[] | null;
  reddit_movies: Movie[] | null;
  letterboxd_movies: Movie[] | null;
}
interface HistoryState {
  homepage: boolean;
  setHomepage: (homepage: boolean) => void;
  tempMessages: string[];
  updateTempMessages: (message: string) => void;
  clearTempMessages: () => void;

  searchHistory: SearchHistory[];
  updateSearchHistory: (searchHistory: SearchHistory) => void;
  clearSearchHistory: () => void;

  results: Result | null;
  updateResults: (result: Result) => void;
  clearResults: () => void;
}

const useHistoryStore = create<HistoryState>((set) => ({
  homepage: true,
  setHomepage: (homepage: boolean) => set({ homepage }),
  tempMessages: [],
  updateTempMessages: (message: string) =>
    set((state) => ({ tempMessages: [...state.tempMessages, message] })),
  clearTempMessages: () => set({ tempMessages: [] }),

  searchHistory: [],
  updateSearchHistory: (searchHistory: SearchHistory) =>
    set((state) => ({
      searchHistory: [...state.searchHistory, searchHistory],
    })),
  clearSearchHistory: () => set({ searchHistory: [] }),

  results: null,
  updateResults: (result: Result) => set({ results: result }),
  clearResults: () => set({ results: null }),
}));

export default useHistoryStore;
