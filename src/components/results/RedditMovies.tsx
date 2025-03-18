import { fetchMoviesByTitle } from "@/axios/fetch";
import useHistoryStore, { Movie } from "@/store/history";
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
import { ArrowBigRight, ArrowUpRight } from "lucide-react";

const RedditMovies = () => {
  const { reddit_movies } = useHistoryStore();
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  useEffect(() => {
    setLoading(true);
    async function fetchMovies() {
      if (!reddit_movies) return;
      const movies = await fetchMoviesByTitle(
        reddit_movies[0].movies.map((movie) => movie.toLowerCase().trim())
      );
      setMovies(movies);
      setLoading(false);
    }
    fetchMovies();
  }, [reddit_movies]);
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
            reddit={true}
            title="Reddit Movies"
            description="Movies that are mentioned in Reddit threads."
          />
        )}
        <a
          href={reddit_movies[0].site_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-4 rounded-md hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 cursor-pointer transition-all duration-300 flex items-center gap-1 w-fit line-clamp-1 max-w-[600px]"
        >
          <ArrowUpRight className="w-4 h-4" />
          {reddit_movies[0].site_url}
        </a>
      </>
    );
  }
};

export default RedditMovies;
