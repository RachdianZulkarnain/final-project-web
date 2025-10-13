"use client";

import { Button } from "@/components/ui/button";
import useGetProperties from "@/app/property/_hooks/useGetProperties";
import useDebounce from "@/app/_hooks/useDebounce";
import { Property as ImportedProperty } from "@/types/property";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PropertyCard from "./components/PropertyCard";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-4 max-w-md rounded-xl bg-white p-8 text-center shadow-md"
        >
          <h1 className="text-2xl font-bold text-[#0290d1]">Oops!</h1>
          <p className="mt-4 text-gray-600">
            Failed to load properties. Please try again later.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="my-20 flex flex-col gap-8 px-4 sm:px-6 lg:px-12">
      {/* Section Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0290d1]">
          Featured Properties
        </h2>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-[#0290d1]" />
          <span className="mt-4 text-base sm:text-lg font-medium text-gray-700">
            Loading properties...
          </span>
        </div>
      ) : !properties.length ? (
        /* Empty State */
        <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <div className="rounded-full bg-[#0290d1]/10 p-5">
            <Search className="h-12 w-12 text-[#0290d1]" />
          </div>
          <p className="mt-6 text-lg sm:text-xl font-semibold text-gray-800">
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
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 5000 })]}
            className="mx-auto w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {properties.slice(0, 7).map((property, i) => (
                <CarouselItem
                  key={property.id}
                  className="px-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>

          {/* Button */}
          <div className="mt-10 flex justify-center">
            <Button
              onClick={handleExploreMore}
              size="lg"
              className="rounded-full bg-[#0290d1] hover:bg-[#027bb3] text-white text-base sm:text-lg font-semibold shadow-md flex items-center px-8 py-5"
            >
              See More Properties
              <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
