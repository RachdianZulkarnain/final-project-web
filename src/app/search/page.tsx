"use client";
import React, { useEffect, useState } from "react";

import Loading from "../loading";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SortSearch } from "./sections/sortSelect";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { SearchListingCard } from "@/components/cards/SearchLisingCard";
import {
  useGetListingsBySearch,
  useGetListingsCategory,
  useGetListingsFacilities,
} from "@/components/listings/hooks/useGetListings";
import SearchBarVariant from "@/components/searchbar/searchBarVariant";
import { Slider } from "@/components/ui/slider";

// ==================== TO CURRENCY FUNCTION ====================
function toCurrency(val: number | undefined) {
  if (val === undefined) val = 0;
  return Number(val).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
}
// ===============================================================

export default function Page() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")));
  const { categories } = useGetListingsCategory();
  const { facilities } = useGetListingsFacilities();
  const [priceRange, setPriceRange] = useState([0, 2500000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState({
    sortBy: "location",
    sort: "",
  });
  const [queryParams, setQueryParams] = useState(
    new URLSearchParams(Object.fromEntries(searchParams.entries()))
  );

  useEffect(() => {
    const selected = searchParams.get("category")?.split(",") || [];
    setSelectedCategories(selected);
    setSort({
      sortBy: searchParams.get("sortBy") || "location",
      sort: searchParams.get("sort") || "",
    });
  }, [searchParams]);

  const { searchResult } = useGetListingsBySearch(queryParams.toString());
  const regex =
    /(&start_date=\d{4}-\d{2}-\d{2}&end_date=\d{4}-\d{2}-\d{2}&adults=\d+&children=\d+)/;
  const pagematcher = queryParams.toString().match(regex);

  const handleCategoryChange = (id: number | string) => {
    const params = new URLSearchParams(queryParams);
    if (id !== "clear") {
      params.set("category", String(id));
    } else {
      params.delete("category");
    }
    window.history.replaceState(null, "", "?" + params.toString());
    setQueryParams(params);
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split(",");
    setSort({ sortBy, sort: sortOrder });
    const params = new URLSearchParams(queryParams);
    params.set("sortBy", sortBy);
    if (sortOrder) params.set("sort", sortOrder);
    else params.delete("sort");
    window.history.replaceState(null, "", "?" + params.toString());
    setQueryParams(params);
  };

  const handleNextPage = () => {
    const next = page + 1;
    setPage(next);
    const params = new URLSearchParams(queryParams);
    params.set("page", next.toString());
    window.history.replaceState(null, "", "?" + params.toString());
    setQueryParams(params);
  };

  const handlePrevPage = () => {
    const prev = page - 1;
    setPage(prev);
    const params = new URLSearchParams(queryParams);
    params.set("page", prev.toString());
    window.history.replaceState(null, "", "?" + params.toString());
    setQueryParams(params);
  };

  const handleTargetPage = (targetPage: number) => {
    setPage(targetPage);
    const params = new URLSearchParams(queryParams);
    params.set("page", targetPage.toString());
    window.history.replaceState(null, "", "?" + params.toString());
    setQueryParams(params);
  };

  if (!categories && !facilities && !searchResult) return <Loading />;

  return (
    <div className="my-32">
      <div className="flex w-[90vw] mx-auto lg:w-[60vw] flex-col md:items-center justify-center gap-8">
        {/* SEARCH BAR */}
        <div className="flex justify-center">
          <SearchBarVariant
            onSubmitCallback={(val: any) => {
              const params = new URLSearchParams(val);
              params.set("page", "1");
              window.history.replaceState(null, "", "?" + params.toString());
              setQueryParams(params);
            }}
            dateParam={{
              from: searchParams.get("start_date"),
              to: searchParams.get("end_date"),
            }}
            guestsParam={{
              adults: searchParams.get("adults"),
              children: searchParams.get("children"),
            }}
            locationParam={searchParams.get("loc_term")}
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid md:flex gap-10">
          {/* FILTER SIDEBAR */}
          <div className="hidden md:top-24 md:block md:sticky h-[500px] rounded-lg w-[300px]">
            <div id="head" className="flex items-center justify-between">
              <div className="font-bold text-lg">Filter</div>
              <div className="text-sm">Reset</div>
            </div>
            <div className="grid gap-4">
              {/* PRICE RANGE */}
              <div>
                <div className="text-sm font-bold my-1">Price range</div>
                <div className="text-xs text-stone-400 font-medium">
                  Per room, per night
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <Slider
                    defaultValue={priceRange}
                    onValueChange={(range: any) => {
                      setPriceRange(range);
                      const params = new URLSearchParams(queryParams);
                      params.set("minPrice", range[0]);
                      params.set("maxPrice", range[1]);
                      window.history.replaceState(
                        null,
                        "",
                        "?" + params.toString()
                      );
                      setQueryParams(params);
                    }}
                    max={10000000}
                    step={50000}
                    min={0}
                  />
                  <div className="numbers-font text-xs flex justify-between">
                    <span className="font-medium">
                      {toCurrency(priceRange[0])}
                    </span>
                    <span className="font-medium">
                      {toCurrency(priceRange[1])}
                    </span>
                  </div>
                </div>
              </div>

              {/* CATEGORIES */}
              <div>
                <div className="text-sm font-bold my-2">Categories</div>
                <Select
                  defaultValue={searchParams.get("category") || ""}
                  onValueChange={(value) => handleCategoryChange(value)}
                >
                  <SelectTrigger className="rounded-full w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    {categories?.map((x: any, i: number) => (
                      <SelectItem key={i} value={`${x.id}`}>
                        {x.category}
                      </SelectItem>
                    ))}
                    <SelectItem value="clear">Clear category filter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* FACILITIES */}
              <div>
                <div className="text-sm font-bold my-2">Facilities</div>
                <ScrollArea className="h-[200px]">
                  {facilities?.map((x: any, i: number) => (
                    <div
                      className="text-sm group py-1 flex items-center gap-2 font-medium"
                      key={i}
                      onClick={() => console.log("facility ID ", x.id)}
                    >
                      <Checkbox />
                      <label className="group-hover:cursor-pointer text-stone-600">
                        {x.facility}
                      </label>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </div>

          {/* MOBILE FILTER SHEET */}
          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden font-bold" variant={"outline"}>
                Show filter
              </Button>
            </SheetTrigger>
            <SheetContent side={"bottom"} className="rounded-t-3xl">
              <div className="p-5">
                {/* ... sama seperti sidebar, bisa copy-paste code sidebar di sini ... */}
              </div>
            </SheetContent>
          </Sheet>

          {/* LISTINGS */}
          {searchResult?.data.length < 1 ? (
            <div className="text-center font-medium text-stone-400 w-[50vw]">
              <div className="font-semibold text-lg">No listings found</div>
              <div className="text-sm">No listing under that search tag.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 md:items-end">
              <SortSearch sortChangeHandler={handleSortChange} sort={sort} />
              <div className="w-[90vw] flex flex-col md:grid md:w-full gap-4">
                {searchResult?.data.map((x: any, i: number) => (
                  <Link
                    key={i}
                    href={`/listings/${x.slug}${
                      pagematcher ? `?${pagematcher[0]}` : ""
                    }`}
                  >
                    <SearchListingCard
                      key={x.id}
                      imageUrl={`${process.env.NEXT_PUBLIC_BASE_API_URL}${x.listing_images[0].image_url}`}
                      title={x.title}
                      city={x.city}
                      country={x.country}
                      price={x?.room_types[0]?.price}
                      seasonalPrice={
                        x.room_types[x.price_indexes?.room_index]
                          ?.seasonal_prices[x.price_indexes?.price_index].price
                      }
                      avgRating={x.avg_rating}
                      facilities={x.listing_facilities}
                    />
                  </Link>
                ))}
              </div>

              {/* PAGINATION */}
              {searchResult?.toShowLength > 8 && (
                <div className="justify-center w-[90vw] md:w-auto flex gap-5">
                  <Button
                    variant={"outline"}
                    disabled={page == 1}
                    onClick={handlePrevPage}
                  >
                    Prev
                  </Button>
                  {Array(Math.ceil(searchResult?.toShowLength / 8))
                    .fill(null)
                    .map((_, i: number) => (
                      <button
                        key={i}
                        className={
                          page == i + 1
                            ? "font-bold"
                            : "font-medium text-stone-500"
                        }
                        onClick={() => handleTargetPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  <Button
                    disabled={page == Math.ceil(searchResult?.toShowLength / 8)}
                    onClick={handleNextPage}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
