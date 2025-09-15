import Autoplay from "embla-carousel-autoplay";
import { ArrowRightCircle, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThumbnailCard } from "@/components/cards/ThumbnailCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";

export const BestDeals = () => {
  const promos = [
    {
      redirectUrl: "/",
      image: "/assets/promo.webp",
    },
    {
      redirectUrl: "/",
      image: "/assets/promo2.webp",
    },
    {
      redirectUrl: "/",
      image: "/assets/promo3.webp",
    },
    {
      redirectUrl: "/",
      image: "/assets/promo4.webp",
    },
  ];
  return (
    <div className="my-16 flex flex-col gap-6">
      <div className="text-3xl font-bold text-[#0290d1]">Best deals for you</div>
      <div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 10000,
            }),
          ]}
          className="mx-auto"
        >
          <CarouselContent className="mx-auto -ml-4">
            {promos.map((x, i: number) => (
              <CarouselItem key={i} className="xl:basis-1/2 2xl:basis-1/3">
                <ThumbnailCard
                  redirectUrl={x.redirectUrl}
                  imageUrl={`${x.image}`}
                ></ThumbnailCard>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <Link href="/" className="flex items-center justify-center">
      <Button
        variant={"outline"}
        size={"lg"}
        className="rounded-full mx-auto text-lg font-semibold text-[#0290d1]"
      >
        See more promos
        <ArrowRight className="ml-3" />
      </Button>
      </Link>
    </div>
  );
};
