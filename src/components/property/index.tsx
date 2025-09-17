"use client";

import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import useGetProperties from "@/hooks/api/property/useGetProperties";
import { Property as ImportedProperty } from "@/types/property";
import PropertyCard from "./components/PropertyCard";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const formatDate = (date: Date): string => date.toISOString().split("T")[0];

export default function PropertyListPage() {
  const router = useRouter();
  const [location] = useState<string>("");
  const [category] = useState<string>("");
  const [checkIn] = useState<Date | undefined>(undefined);
  const [checkOut] = useState<Date | undefined>(undefined);
  const [search] = useState<string>("");
  const [guest] = useState<number | undefined>(undefined);
  const [page] = useState<number>(1);

  const debouncedSearch = useDebounce(search, 500);
  const formattedStartDate = checkIn ? formatDate(checkIn) : "";
  const formattedEndDate = checkOut ? formatDate(checkOut) : "";

  const { data, isLoading, isError } = useGetProperties({
    page,
    location,
    category,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    search: debouncedSearch,
    guest,
  });

  const properties: ImportedProperty[] = data?.data?.data ?? [];

  const handleExploreMore = () => {
    router.push("/property-catalog");
  };

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-[#CDF5FD]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-4 max-w-md rounded-2xl bg-white p-8 text-center shadow-lg"
        >
          <h1 className="text-3xl font-bold text-[#00A9FF]">Oops!</h1>
          <p className="mt-4 text-gray-600">
            Failed to load properties. Please try again later.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="my-16 flex flex-col gap-6 px-4 sm:px-6 lg:px-16">
      {/* Section Title */}
      <div className="text-2xl sm:text-3xl font-bold text-[#0290d1]">
        Featured Properties
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#00A9FF]" />
          <span className="mt-4 text-base sm:text-lg font-medium text-gray-600">
            Loading amazing properties...
          </span>
        </div>
      ) : !properties.length ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <div className="rounded-full bg-[#A0E9FF]/20 p-4">
            <Search className="h-12 w-12 text-[#00A9FF]" />
          </div>
          <p className="mt-6 text-lg sm:text-xl font-medium text-gray-800">
            No properties found
          </p>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <>
          {/* Carousel */}
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            className="mx-auto w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {properties.slice(0, 7).map((property, i) => (
                <CarouselItem
                  key={property.id}
                  className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 px-2"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* CTA Button */}
          <div className="mt-8 flex justify-center text-[#00A9FF]">
            <Button
              onClick={handleExploreMore}
              variant="outline"
              size="lg"
              className="rounded-full text-base sm:text-lg font-semibold flex items-center"
            >
              See More Properties
              <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
