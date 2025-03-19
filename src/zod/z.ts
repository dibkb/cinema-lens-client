import { z } from "zod";

export const moviesResponseSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    year: z.number(),
    rating: z.number(),
    poster_url: z.string(),
    actors: z.array(z.string()),
    directors: z.array(z.string()),
    genres: z.array(z.string()),
  })
);
