import { processImageUrl } from "@/utils/modifiler";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import { genres } from "@/data/genre";
import { z } from "zod";
import { moviesResponseSchema } from "@/zod/z";

const MoviesRenderer = ({
  movies,
  title,
  description,
}: {
  movies: z.infer<typeof moviesResponseSchema>;
  title: string;
  description: string;
  reddit?: boolean;
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="item-01">
      <AccordionItem value="item-01">
        <AccordionTrigger className="flex items-center gap-2">
          {title}
        </AccordionTrigger>
        <p className="text-sm text-stone-500">{description}</p>
        <AccordionContent>
          <div className="relative w-full px-4">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full mt-4"
            >
              <CarouselContent>
                {movies.map((movie) => (
                  <CarouselItem
                    key={movie?.id}
                    className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 pl-1 group"
                  >
                    <div className="p-1 min-h-[200px] group-hover:scale-105 transition-all duration-300 relative">
                      <img
                        src={processImageUrl(movie?.poster_url ?? "") || ""}
                        alt={movie?.title ?? "Missing title"}
                        className="w-full h-full object-cover rounded-sm"
                      />
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-3 text-white rounded-sm">
                        {movie?.year && (
                          <p className="text-xs mb-1 font-semibold">
                            ({movie?.year})
                          </p>
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
                      <p className="capitalize line-clamp-1 text-xs">
                        {movie?.title ?? "Missing title"}
                      </p>
                      {/* <p className="text-xs text-zinc-400">({movie?.year})</p> */}
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
  );
};

export default MoviesRenderer;
