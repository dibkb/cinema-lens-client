import { fetchMoviesByTitle } from "@/axios/fetch";
import useHistoryStore from "@/store/history";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";

import MoviesRenderer from "./render";
import { moviesResponseSchema } from "@/zod/z";
import { z } from "zod";
import { filterMovies } from "@/utils/modifiler";
const RedditMovies = () => {
  const { reddit_movies, entities } = useHistoryStore();
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<z.infer<typeof moviesResponseSchema>>(
    []
  );
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    async function fetchMovies() {
      if (!reddit_movies || reddit_movies.length === 0) return;

      try {
        // Create an array of promises for each reddit movie source
        const moviePromises = reddit_movies.map((redditMovie) => {
          const movieTitles = redditMovie.movies.map((movie) =>
            movie.toLowerCase().trim()
          );
          return fetchMoviesByTitle(movieTitles);
        });

        // Execute all fetch requests in parallel
        const movieResults = await Promise.all(moviePromises);
        const flatMovies = movieResults.flat();
        const filteredMovies = filterMovies(flatMovies, entities);
        const parsedMovies = moviesResponseSchema.safeParse(filteredMovies);
        if (parsedMovies.success) {
          setMovies(parsedMovies.data);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [reddit_movies, entities]);
  if (error) {
    return;
  }
  if (loading) {
    return (
      <div className="relative w-full px-4">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full mt-4"
        >
          <CarouselContent>
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3 pl-4"
              >
                <div className="p-1">
                  <Skeleton className="h-[200px] w-full rounded aspect-square" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 cursor-pointer" />
          <CarouselNext className="right-1 cursor-pointer" />
        </Carousel>
      </div>
    );
  } else {
    return (
      <>
        {movies.length > 0 && (
          <div className="flex flex-col gap-2">
            <MoviesRenderer
              movies={movies}
              title="Reddit Movies"
              description="Movies that are mentioned in Reddit threads."
            />
            <div className="flex gap-2 flex-wrap">
              {reddit_movies.map((redditMovie) => (
                <a
                  href={redditMovie.site_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-4 rounded-lg bg-zinc-50 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 max-w-[300px] truncate"
                >
                  {redditMovie.site_url}
                </a>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }
};

export default RedditMovies;
