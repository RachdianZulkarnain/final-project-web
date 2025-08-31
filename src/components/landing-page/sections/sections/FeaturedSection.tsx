// src/components/landing-page/sections/FeaturedSection.tsx
"use client";

import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ListingCard } from "@/components/cards/ListingCard";

// Dummy listings dengan gambar online dari picsum.photos
const dummyListings = [
  {
    id: 1,
    slug: "modern-loft-nyc",
    title: "Modern Loft in NYC",
    city: "New York",
    country: "USA",
    avg_rating: 4.8,
    listing_images: [{ image_url: "https://picsum.photos/seed/loft/600/400" }],
    room_types: [
      { price: 120, seasonal_prices: [{ season: "Summer", price: 150 }] },
    ],
  },
  {
    id: 2,
    slug: "cozy-apartment-paris",
    title: "Cozy Apartment in Paris",
    city: "Paris",
    country: "France",
    avg_rating: 4.5,
    listing_images: [
      { image_url: "https://picsum.photos/seed/apartment/600/400" },
    ],
    room_types: [
      { price: 100, seasonal_prices: [{ season: "Winter", price: 90 }] },
    ],
  },
  {
    id: 3,
    slug: "beach-house-bali",
    title: "Beach House in Bali",
    city: "Bali",
    country: "Indonesia",
    avg_rating: 4.9,
    listing_images: [
      { image_url: "https://picsum.photos/seed/beachhouse/600/400" },
    ],
    room_types: [
      { price: 200, seasonal_prices: [{ season: "Peak", price: 250 }] },
    ],
  },
  {
    id: 4,
    slug: "mountain-cabin-swiss",
    title: "Mountain Cabin in Swiss Alps",
    city: "Zermatt",
    country: "Switzerland",
    avg_rating: 4.7,
    listing_images: [{ image_url: "https://picsum.photos/seed/cabin/600/400" }],
    room_types: [{ price: 180, seasonal_prices: [] }],
  },
  {
    id: 5,
    slug: "urban-flat-tokyo",
    title: "Urban Flat in Tokyo",
    city: "Tokyo",
    country: "Japan",
    avg_rating: 4.6,
    listing_images: [{ image_url: "https://picsum.photos/seed/flat/600/400" }],
    room_types: [{ price: 130, seasonal_prices: [] }],
  },
  {
    id: 6,
    slug: "rustic-cottage-uk",
    title: "Rustic Cottage in UK",
    city: "Cotswolds",
    country: "United Kingdom",
    avg_rating: 4.4,
    listing_images: [
      { image_url: "https://picsum.photos/seed/cottage/600/400" },
    ],
    room_types: [
      { price: 110, seasonal_prices: [{ season: "Spring", price: 120 }] },
    ],
  },
  {
    id: 7,
    slug: "luxury-villa-miami",
    title: "Luxury Villa in Miami",
    city: "Miami",
    country: "USA",
    avg_rating: 4.9,
    listing_images: [{ image_url: "https://picsum.photos/seed/villa/600/400" }],
    room_types: [
      { price: 350, seasonal_prices: [{ season: "Winter", price: 400 }] },
    ],
  },
];

export const FeaturedRooms = () => {
  return (
    <div className="my-16 flex flex-col gap-6">
      <div className="text-3xl font-bold">Featured rooms</div>
      <div>
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 5000 })]}
          className="mx-auto"
        >
          <CarouselContent className="mx-auto -ml-4">
            {dummyListings.map((x, i) => (
              <CarouselItem
                key={i}
                className="md:basis-1/2 xl:basis-1/4 2xl:basis-1/5"
              >
                <Link href={`/listings/${x.slug}`}>
                  <ListingCard
                    key={x.id}
                    imageUrl={x.listing_images[0].image_url}
                    title={x.title}
                    city={x.city}
                    country={x.country}
                    price={x.room_types[0].price}
                    seasonalPrice={x.room_types[0]?.seasonal_prices[0]?.price}
                    avgRating={x.avg_rating}
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <Link href={"/search"} className="mx-auto">
        <Button
          variant={"outline"}
          size={"lg"}
          className="rounded-full text-lg font-semibold"
        >
          See more rooms
          <ArrowRight className="ml-3" />
        </Button>
      </Link>
    </div>
  );
};
