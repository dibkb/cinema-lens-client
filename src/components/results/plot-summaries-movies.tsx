import { fetchMoviesByTitle } from "@/axios/fetch";
import { Skeleton } from "@/components/ui/skeleton";

import { genres } from "@/data/genre";
import useHistoryStore from "@/store/history";
import { processImageUrl } from "@/utils/modifiler";
import { moviesResponseSchema } from "@/zod/z";
import { useEffect, useState } from "react";
import { z } from "zod";

const PlotSummariesMovies = () => {
  const { plot_summaries } = useHistoryStore();

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<z.infer<typeof moviesResponseSchema>>(
    []
  );
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    async function fetchMovies() {
      if (!plot_summaries || plot_summaries.length === 0) return;

      try {
        // Create an array of promises for each reddit movie source
        const moviePromises = plot_summaries.map((summary) => {
          return fetchMoviesByTitle([summary.toLowerCase().trim()]);
        });

        // Execute all fetch requests in parallel
        const movieResults = await Promise.all(moviePromises);
        const flatMovies = movieResults.flat();
        const parsedMovies = moviesResponseSchema.safeParse(flatMovies);
        if (!parsedMovies.success || parsedMovies.data.length === 0) {
          setError(true);
        } else {
          setMovies(parsedMovies.data);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [plot_summaries]);

  if (error) {
    return;
  }
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-[200px] w-full rounded aspect-square"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-stone-600 mb-4">
        Most similar movies for your query in order of similarity
      </p>
      {movies.map((movie) => (
        <div key={movie?.id} className="group aspect-square max-w-[200px] mb-4">
          <div className="p-1 min-h-[200px] group-hover:scale-105 transition-all duration-300 relative">
            <img
              src={processImageUrl(movie?.poster_url ?? "") || ""}
              alt={movie?.title ?? "Missing title"}
              className="w-full h-full object-cover rounded-sm"
            />
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-3 text-white rounded-sm">
              {movie?.year && (
                <p className="text-xs mb-1 font-semibold">({movie?.year})</p>
              )}

              {movie?.genres && (
                <div className="flex flex-wrap gap-1">
                  {movie?.genres.map((genre) => {
                    return (
                      <span className="w-full font-semibold">
                        {
                          genres.find(
                            (g) =>
                              g.name.split(" ")[1].toLowerCase() ===
                              genre.toLowerCase()
                          )?.name
                        }
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="mt-1 flex gap-1">
            <p className="capitalize line-clamp-1 text-sm font-medium">
              {movie?.title}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default PlotSummariesMovies;
