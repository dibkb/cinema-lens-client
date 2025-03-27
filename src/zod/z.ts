import { z } from "zod";

export const moviesResponseSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string().nullable(),
    year: z.number().nullable(),
    poster_url: z.string().nullable(),
    actors: z.array(z.string()).nullable(),
    directors: z.array(z.string()).nullable(),
    genres: z.array(z.string()).nullable(),
  })
);
