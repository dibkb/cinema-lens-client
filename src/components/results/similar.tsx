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

const SimilarMovies = () => {
  const { similar_movies, entities } = useHistoryStore();
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<z.infer<typeof moviesResponseSchema>>(
    []
  );
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    async function fetchMovies() {
      if (!similar_movies) return;
      const movies = await fetchMoviesByTitle(similar_movies);
      const filteredMovies = filterMovies(movies, entities);
      const parsedMovies = moviesResponseSchema.safeParse(filteredMovies);
      if (parsedMovies.success) {
        setMovies(parsedMovies.data);
      } else {
        setError(true);
      }
      setLoading(false);
    }
    fetchMovies();
  }, [similar_movies, entities]);
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
          <MoviesRenderer
            movies={movies}
            title="Similar Movies"
            description="Movies that have a similar plot to your mentioned film."
          />
        )}
      </>
    );
  }
};

export default SimilarMovies;
