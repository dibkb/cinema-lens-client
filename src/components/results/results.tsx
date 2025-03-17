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
import { processImageUrl } from "@/utils/modifiler";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

function Results() {
  const { results } = useHistoryStore();
  const [loading, setLoading] = useState(true);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  console.log(results);
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
      setLoading(false);
    }
    fetchMovies();
  }, [results]);
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
        <Accordion type="single" collapsible defaultValue="item-01">
          <AccordionItem value="item-01">
            <AccordionTrigger className="">
              Similar Movies by Plot
            </AccordionTrigger>
            <p className="text-sm text-stone-500">
              Movies that share the same plot as your requested film.
            </p>
            <AccordionContent>
              <div className="relative w-full px-4">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full mt-4"
                >
                  <CarouselContent>
                    {similarMovies.map((movie) => (
                      <CarouselItem
                        key={movie.poster_url}
                        className="md:basis-1/2 lg:basis-1/3 pl-1"
                      >
                        <div className="p-1 h-[400px]">
                          <img
                            src={processImageUrl(movie.poster_url)}
                            alt={movie.title}
                            className="w-full h-full object-cover rounded-sm"
                          />
                        </div>
                        <div className="mt-1 flex gap-1">
                          <p className="capitalize line-clamp-1">
                            {movie.title}
                          </p>
                          <p className="text-sm text-zinc-400">
                            ({movie.year})
                          </p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-1 cursor-pointer" />
                  <CarouselNext className="right-1 cursor-pointer" />
                </Carousel>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible defaultValue="item-01">
          <AccordionItem value="item-01">
            <AccordionTrigger className="">Related Movies</AccordionTrigger>
            <p className="text-sm text-stone-500">
              Movies that share common actors, genres, or directors with your
              requested film.
            </p>
            <AccordionContent>
              <div className="relative w-full px-4">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full mt-4"
                >
                  <CarouselContent>
                    {relatedMovies.map((movie) => (
                      <CarouselItem
                        key={movie.poster_url}
                        className="md:basis-1/2 lg:basis-1/3 pl-1"
                      >
                        <div className="p-1 h-[400px]">
                          <img
                            src={processImageUrl(movie.poster_url)}
                            alt={movie.title}
                            className="w-full h-full object-cover rounded-sm"
                          />
                        </div>
                        <div className="mt-1 flex gap-1">
                          <p className="capitalize line-clamp-1">
                            {movie.title}
                          </p>
                          <p className="text-sm text-zinc-400">
                            ({movie.year})
                          </p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-1 cursor-pointer" />
                  <CarouselNext className="right-1 cursor-pointer" />
                </Carousel>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </>
    );
  }
}

export default Results;
