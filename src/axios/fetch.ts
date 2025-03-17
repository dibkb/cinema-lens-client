import { api } from "./base";

export const fetchMoviesByTitle = async (title: string[]) => {
  try {
    const response = await api.post(`movies/batch-by-title`, title);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies by title:", error);
    return [];
  }
};

export const fetchMoviesById = async (ids: number[]) => {
  try {
    const response = await api.post("/movies/batch-by-ids", ids);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies by IDs:", error);
    return [];
  }
};
