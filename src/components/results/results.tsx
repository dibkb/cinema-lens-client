import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useHistoryStore, { Movie } from "@/store/history";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { fetchMoviesById, fetchMoviesByTitle } from "@/axios/fetch";

import MoviesRenderer from "./similar";
function Results() {
  const { results, clearTempMessages } = useHistoryStore();
  const [loading, setLoading] = useState(true);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  useEffect(() => {
    setLoading(true);
    async function fetchMovies() {
      if (!results) return;
      const [relatedMovies, similarMovies] = await Promise.all([
        fetchMoviesById(
          results.similar_movies_by_features.map((movie) => movie.id)
        ),
        fetchMoviesByTitle(results.similar_movies_by_plot),
      ]);
      setRelatedMovies(relatedMovies);
      setSimilarMovies(similarMovies);
      clearTempMessages();

      setLoading(false);
    }
    fetchMovies();
  }, [results, clearTempMessages]);
  // Render skeleton loader if results are not available
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
                  <Skeleton className="h-[400px] w-full rounded aspect-square" />
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
        {similarMovies.length > 0 && (
          <MoviesRenderer
            movies={similarMovies}
            title="Similar Movies"
            description="Movies that have a similar plot to your mentioned film."
          />
        )}

        {relatedMovies.length > 0 && (
          <MoviesRenderer
            movies={relatedMovies}
            title="Related Movies"
            description="Movies that have the same actors or directors or genres as your mentioned film."
          />
        )}
      </>
    );
  }
}

export default Results;
