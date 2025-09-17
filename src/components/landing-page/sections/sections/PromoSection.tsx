"use client";

import { ThumbnailCard } from "@/components/cards/ThumbnailCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const BestDeals = () => {
  const promos = [
    { redirectUrl: "/", image: "/assets/promo.webp" },
    { redirectUrl: "/", image: "/assets/promo2.webp" },
    { redirectUrl: "/", image: "/assets/promo3.webp" },
    { redirectUrl: "/", image: "/assets/promo4.webp" },
  ];

  return (
    <div className="my-16 flex flex-col gap-6 px-4 sm:px-0">
      {/* Section Title */}
      <div className="text-3xl font-bold text-[#0290d1] text-center sm:text-left">
        Best deals for you
      </div>

      {/* Carousel */}
      <div className="w-full">
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 10000 })]}
          className="mx-auto w-full"
        >
          <CarouselContent className="-ml-2 sm:-ml-4">
            {promos.map((promo, i) => (
              <CarouselItem
                key={i}
                className="basis-full sm:xl:basis-1/2 2xl:basis-1/3 px-2"
              >
                <ThumbnailCard
                  redirectUrl={promo.redirectUrl}
                  imageUrl={promo.image}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-4">
        <Link href="/">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-full sm:w-auto text-lg font-semibold flex items-center justify-center text-[#0290d1]"
          >
            See more promos
            <ArrowRight className="ml-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
