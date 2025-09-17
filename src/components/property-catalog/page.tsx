"use client";

import { Input } from "@/components/ui/input";
import { Property } from "@/types/property";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import useGetProperties from "../../hooks/api/property/useGetProperties";
import useDebounce from "../../hooks/useDebounce";
import CatalogPagination from "../CatalogPagination";
import PropertyCard from "../property/components/PropertyCard";
import PropertyNavigation from "./components/PropertyNavigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PropertyCatalogPage() {
  // NuQS states
  const [location, setLocation] = useQueryState<string>("location", {
    defaultValue: "",
    parse: (val) => val ?? "",
  });

  const [category, setCategory] = useQueryState<string>("category", {
    defaultValue: "",
    parse: (val) => val ?? "",
  });

  const [checkInStr, setCheckInStr] = useQueryState<string>("checkIn", {
    defaultValue: "",
    parse: (val) => val ?? "",
  });

  const [checkOutStr, setCheckOutStr] = useQueryState<string>("checkOut", {
    defaultValue: "",
    parse: (val) => val ?? "",
  });

  const [search, setSearch] = useQueryState<string>("search", {
    defaultValue: "",
    parse: (val) => val ?? "",
  });

  const [guest, setGuest] = useQueryState<number | undefined>("guest", {
    defaultValue: undefined,
    parse: (val) => {
      const n = parseInt(val, 10);
      return isNaN(n) ? undefined : n;
    },
  });

  const [page, setPage] = useQueryState<number>("page", {
    defaultValue: 1,
    parse: (val) => {
      const n = parseInt(val, 10);
      return isNaN(n) ? 1 : n;
    },
  });

  const [sortBy, setSortBy] = useQueryState<string>("sortBy", {
    defaultValue: "title",
    parse: (val) => val ?? "title",
  });

  const [sortOrder, setSortOrder] = useQueryState<"asc" | "desc">("sortOrder", {
    defaultValue: "asc",
    parse: (val) => (val === "asc" || val === "desc" ? val : "asc"),
  });

  // Parse string ke Date
  const checkIn = checkInStr ? parseISO(checkInStr) : undefined;
  const checkOut = checkOutStr ? parseISO(checkOutStr) : undefined;

  const debouncedSearch = useDebounce(search, 500);
  const formattedStartDate = checkIn ? format(checkIn, "yyyy-MM-dd") : "";
  const formattedEndDate = checkOut ? format(checkOut, "yyyy-MM-dd") : "";
  const hasActiveFilters = location || category || checkIn || checkOut || guest;

  const { data, isLoading, isError } = useGetProperties({
    page: page ?? 1, // fallback ke 1 jika null
    location,
    category,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    search: debouncedSearch,
    guest: guest ?? undefined, // konversi null ke undefined
    sortBy,
    sortOrder,
  });

  // Handler
  const clearAllFilters = () => {
    setLocation("");
    setCategory("");
    setCheckInStr("");
    setCheckOutStr("");
    setGuest(null);
    setSearch("");
    setPage(1);
    setSortBy("title");
    setSortOrder("asc");
    setSortBy("title");
    setSortOrder("asc");
  };

  const propertyCards = useMemo(
    () =>
      data?.data?.data.map((property: Property, index: number) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 12px 24px rgba(0,0,0,0.15)",
          }}
          className="overflow-hidden rounded-xl bg-white shadow-lg"
        >
          <PropertyCard property={property} />
        </motion.div>
      )) ?? [],
    [data]
  );

  // Error State
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-[#F0F9FF]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-4 max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl"
        >
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
            <span className="text-5xl">🏠</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Oops!</h1>
          <p className="mt-6 text-xl text-gray-600">
            We couldn't load the properties right now. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 rounded-xl bg-blue-600 px-10 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 mt-13">
      {/* Search + Navigation */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-2">
          {/* Search Bar */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <Input
              className="w-full rounded-full border border-gray-200 bg-white py-4 pl-12 pr-4 text-base text-gray-800 placeholder-gray-500 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:py-5 md:text-lg"
              placeholder="Search properties name"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              aria-label="Search properties"
            />
          </div>

          {/* Navigation */}
          <div className="w-full md:w-auto md:flex-shrink-0">
            <PropertyNavigation
              onLocation={setLocation}
              onCategory={setCategory}
              onCheckIn={(date: Date | undefined) => {
                setCheckInStr(date ? format(date, "yyyy-MM-dd") : null);
              }}
              onCheckOut={(date: Date | undefined) => {
                setCheckOutStr(date ? format(date, "yyyy-MM-dd") : null);
              }}
              onGuest={(value: number | undefined) => {
                setGuest(value ?? null); // NuQS number expects null to reset
              }}
            />
          </div>

          {/* Sort Section */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <Select
              onValueChange={(value) => {
                if (value === "title") {
                  setSortBy("title");
                  setSortOrder("asc");
                } else if (value === "price") {
                  setSortBy("price");
                  setSortOrder("asc");
                } else if (value === "price_desc") {
                  setSortBy("price");
                  setSortOrder("desc");
                } else if (value === "createdAt") {
                  setSortBy("createdAt");
                  setSortOrder("desc");
                }
              }}
              value={
                sortBy === "price" && sortOrder === "desc"
                  ? "price_desc"
                  : sortBy
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Name A–Z</SelectItem>
                <SelectItem value="price">Price Low → High</SelectItem>
                <SelectItem value="price_desc">Price High → Low</SelectItem>
                <SelectItem value="createdAt">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/*Active Filters */}
      {hasActiveFilters && (
        <div className="container mx-auto px-6 pb-6 pt-4">
          <div className="mx-auto max-w-7xl flex flex-wrap gap-3">
            {location && (
              <span className="flex items-center rounded-full bg-blue-100 px-5 py-2 text-base text-blue-700">
                {location}
                <button
                  onClick={() => setLocation("")}
                  className="ml-3 text-blue-400 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {category && (
              <span className="flex items-center rounded-full bg-blue-100 px-5 py-2 text-base text-blue-700">
                {category}
                <button
                  onClick={() => setCategory("")}
                  className="ml-3 text-blue-400 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {checkIn && (
              <span className="flex items-center rounded-full bg-blue-100 px-5 py-2 text-base text-blue-700">
                Check-in: {format(checkIn, "MMM dd, yyyy")}
                <button
                  onClick={() => setCheckInStr("")}
                  className="ml-3 text-blue-400 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {checkOut && (
              <span className="flex items-center rounded-full bg-blue-100 px-5 py-2 text-base text-blue-700">
                Check-out: {format(checkOut, "MMM dd, yyyy")}
                <button
                  onClick={() => setCheckOutStr("")}
                  className="ml-3 text-blue-400 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {guest && (
              <span className="flex items-center rounded-full bg-blue-100 px-5 py-2 text-base text-blue-700">
                {guest} Guest{guest > 1 ? "s" : ""}
                <button
                  onClick={() => setGuest(null)}
                  className="ml-3 text-blue-400 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="rounded-full bg-gray-200 px-5 py-2 text-base font-medium text-gray-700 hover:bg-gray-300"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Property Cards */}
      <main className="container mx-auto flex-1 px-6 pb-16 mt-8">
        {isLoading ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-80 flex-col items-center justify-center"
          >
            <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
            <span className="mt-6 text-xl font-medium text-gray-600">
              Finding your perfect stay...
            </span>
          </motion.div>
        ) : !data?.data?.data?.length ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-[60vh] flex-col items-center justify-center text-center"
          >
            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-blue-100">
              <Search className="h-16 w-16 text-blue-500" />
            </div>
            <h3 className="mb-4 text-3xl font-medium text-[#0290D1]">
              No properties found
            </h3>
            <p className="max-w-xl text-xl text-gray-600">
              We couldn't find any properties matching your criteria. Try
              adjusting your filters or search terms.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-8 rounded-xl bg-blue-600 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-[#0290D1]">
                {data?.data?.meta?.totalCount || ""} Properties Found
              </h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4"
            >
              {propertyCards}
            </motion.div>

            {/* Pagination */}
            {data?.data?.data?.length > 0 && (
              <div className="mt-10 flex justify-center text-[#0290D1]">
                <CatalogPagination
                  page={data?.data?.meta?.page || 1}
                  take={data?.data?.meta?.take || 10}
                  totalCount={data?.data?.meta?.totalCount || 0}
                  onChangePage={setPage}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
