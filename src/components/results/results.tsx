import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useHistoryStore from "@/store/history";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
function Results() {
  const { results } = useHistoryStore();
  const [loading, setLoading] = useState(true);
  // Render skeleton loader if results are not available
  if (loading) {
    return (
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-4"
      >
        <CarouselContent>
          {Array.from({ length: 6 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Skeleton className="h-full w-full rounded" />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="cursor-pointer" />
        <CarouselNext className="cursor-pointer" />
      </Carousel>
    );
  } else {
    return (
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-4"
      >
        <CarouselContent>
          {results?.similar_movies_by_features.map((movie) => (
            <CarouselItem key={movie.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{movie.id}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="cursor-pointer" />
        <CarouselNext className="cursor-pointer" />
      </Carousel>
    );
  }
}
export default Results;
