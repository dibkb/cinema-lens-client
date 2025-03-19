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
export interface RedditResult {
  movies: string[];
  site_url: string;
}
export interface Entity {
  movie: string[] | null;
  actor: string[] | null;
  director: string[] | null;
  year_start: number | null;
  year_end: number | null;
  genre: string[] | null;
  actors_union: boolean | null;
  genres_union: boolean | null;
  search_query: string;
  parsing_review: string;
}

interface HistoryState {
  homepage: boolean;
  setHomepage: (homepage: boolean) => void;
  tempMessages: string[];
  updateTempMessages: (message: string) => void;
  clearTempMessages: () => void;

  similar_movies: string[];
  related_movies: string[];
  reddit_movies: RedditResult[];
  letterboxd_movies: RedditResult[];

  setSimilarMovies: (similar_movies: string[]) => void;
  setRelatedMovies: (related_movies: string[]) => void;
  setRedditMovies: (reddit_movies: RedditResult[]) => void;
  setLetterboxdMovies: (letterboxd_movies: RedditResult[]) => void;

  title: string;
  setTitle: (title: string) => void;

  entities: Entity;
  setEntities: (entities: Entity) => void;
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
  setRelatedMovies: (related_movies: string[]) => set({ related_movies }),
  setRedditMovies: (reddit_movies: RedditResult[]) => set({ reddit_movies }),
  setLetterboxdMovies: (letterboxd_movies: RedditResult[]) =>
    set({ letterboxd_movies }),

  entities: {
    movie: null,
    actor: null,
    director: null,
    year_start: null,
    year_end: null,
    genre: null,
    actors_union: null,
    genres_union: null,
    search_query: "",
    parsing_review: "",
  },
  setEntities: (entities: Entity) => set({ entities }),
}));

export default useHistoryStore;
