import { create } from "zustand";

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
interface HistoryState {
  homepage: boolean;
  setHomepage: (homepage: boolean) => void;
  tempMessages: string[];
  updateTempMessages: (message: string) => void;
  clearTempMessages: () => void;

  similar_movies: string[];
  related_movies: { id: number }[];
  reddit_movies: string[];
  letterboxd_movies: string[];

  setSimilarMovies: (similar_movies: string[]) => void;
  setRelatedMovies: (related_movies: { id: number }[]) => void;
  setRedditMovies: (reddit_movies: string[]) => void;
  setLetterboxdMovies: (letterboxd_movies: string[]) => void;

  title: string;
  setTitle: (title: string) => void;
}

const useHistoryStore = create<HistoryState>((set) => ({
  homepage: true,
  setHomepage: (homepage: boolean) => set({ homepage }),
  tempMessages: [],
  updateTempMessages: (message: string) =>
    set((state) => ({ tempMessages: [...state.tempMessages, message] })),
  clearTempMessages: () => set({ tempMessages: [] }),

  title: "",
  setTitle: (title: string) => set({ title }),

  similar_movies: [],
  related_movies: [],
  reddit_movies: [],
  letterboxd_movies: [],

  setSimilarMovies: (similar_movies: string[]) => set({ similar_movies }),
  setRelatedMovies: (related_movies: { id: number }[]) =>
    set({ related_movies }),
  setRedditMovies: (reddit_movies: string[]) => set({ reddit_movies }),
  setLetterboxdMovies: (letterboxd_movies: string[]) =>
    set({ letterboxd_movies }),
}));

export default useHistoryStore;
