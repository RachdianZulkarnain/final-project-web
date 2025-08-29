// src/components/landing-page/sections/PromoSection.tsx
"use client";

import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ThumbnailCard } from "@/components/cards/ThumbnailCard";

export const BestDeals = () => {
  const promos = [
    {
      redirectUrl: "/promo/1",
      image: "https://picsum.photos/id/1035/600/400",
    },
    {
      redirectUrl: "/promo/2",
      image: "https://picsum.photos/id/1036/600/400",
    },
    {
      redirectUrl: "/promo/3",
      image: "https://picsum.photos/id/1037/600/400",
    },
    {
      redirectUrl: "/promo/4",
      image: "https://picsum.photos/id/1038/600/400",
    },
    {
      redirectUrl: "/promo/5",
      image: "https://picsum.photos/id/1039/600/400",
    },
  ];

  return (
    <div className="my-16 flex flex-col gap-6">
      <div className="text-3xl font-bold">Best deals for you</div>
      <div>
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 10000 })]}
          className="mx-auto"
        >
          <CarouselContent className="mx-auto -ml-4">
            {promos.map((x, i) => (
              <CarouselItem key={i} className="xl:basis-1/2 2xl:basis-1/3">
                <ThumbnailCard redirectUrl={x.redirectUrl} imageUrl={x.image} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <Button
        variant="outline"
        size="lg"
        className="rounded-full mx-auto text-lg font-semibold"
      >
        See more promos
        <ArrowRight className="ml-3" />
      </Button>
    </div>
  );
};
