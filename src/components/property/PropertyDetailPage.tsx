"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetProperty from "@/hooks/api/property/useGetProperty";
import {
  standardizeToCheckInTime,
  standardizeToCheckOutTime,
} from "@/utils/date";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import PropertyDetailCard from "../PropertyDetailCard";
import { RoomPriceCalendar } from "./components/RoomPriceCalendar";

type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[450px] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col items-center text-slate-400">
        <Skeleton className="h-8 w-8 rounded-full" />
        <p className="mt-2 font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `${Math.floor(price / 1000)}k`;
  }
  return price.toString();
};

function PropertyDetailSkeleton() {
  return (
    <main className="mx-auto my-8 max-w-screen-2xl px-4 sm:my-12 sm:px-6">
      <Card className="overflow-hidden border-0 bg-white shadow-xl shadow-slate-200/50 rounded-3xl">
        <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-3 lg:p-8">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-[400px] sm:h-[500px] w-full rounded-2xl" />
            <div className="grid grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
              ))}
            </div>
            <div className="mt-8 space-y-6">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}

export default function PropertyDetailPage({
  propertySlug,
}: {
  propertySlug: string;
}) {
  const router = useRouter();
  const { data: session } = useSession(); // ambil session
  const { data: property, isPending } = useGetProperty(propertySlug);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [activeTab, setActiveTab] = useState("description");
  const [highlightMap, setHighlightMap] = useState(false);

  const mapSectionRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  if (isPending) return <PropertyDetailSkeleton />;
  if (!property) return <div>Property not found</div>;

  const availableRooms = property.room.filter((room) => !room.isDeleted);

  const selectedRoom = availableRooms.find(
    (room) => room.id.toString() === selectedRoomId
  );

  const handleBooking = () => {
    if (!selectedRoom || !dateRange.from || !dateRange.to) return;

    const checkInDate = standardizeToCheckInTime(dateRange.from);
    const checkOutDate = standardizeToCheckOutTime(dateRange.to);

    const params = new URLSearchParams({
      roomId: selectedRoom.id.toString(),
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      propertyId: property.id.toString(),
      propertySlug: propertySlug,
    });

    router.push(`/payment?${params.toString()}`);
  };

  const handlePositionChange = (lat: string, lng: string) => {};

  const handleShowOnMap = () => {
    setActiveTab("location");

    setTimeout(() => {
      if (tabsRef.current) {
        tabsRef.current.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          if (mapSectionRef.current) {
            mapSectionRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });

            setHighlightMap(true);
            setTimeout(() => setHighlightMap(false), 2000);
          }
        }, 300);
      }
    }, 100);
  };

  return (
    <main className="mx-auto my-8 max-w-screen-2xl px-4 sm:my-12 sm:px-6 ">
      <div className="mb-6 text-sm text-slate-500">
        <span className="hover:text-[#0290d1] hover:underline transition-colors cursor-pointer">
          Properties
        </span>
        <span className="mx-2 text-slate-300">›</span>
        <span className="text-slate-700 font-medium">{property.title}</span>
      </div>

      <Card className="overflow-hidden border-0  bg-white shadow-xl shadow-slate-200/50 rounded-3xl">
        <div className="grid grid-cols-1 gap-8  p-6 lg:grid-cols-3 lg:p-8">
          <div className="space-y-6 lg:col-span-2">
            <div className="group relative  h-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 sm:h-[500px] shadow-lg">
              <Image
                src={
                  property.propertyImage[activeImageIndex]?.imageUrl ||
                  "/placeholder.jpg" ||
                  "/placeholder.svg"
                }
                alt={property.title}
                className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                fill
                priority
              />
              <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 transition-all duration-300 group-hover:opacity-100">
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) => Math.max(0, prev - 1))
                  }
                  className="rounded-full bg-white/95 p-3 text-slate-700 shadow-lg backdrop-blur-md transition-all hover:bg-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={activeImageIndex === 0}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      Math.min(property.propertyImage.length - 1, prev + 1)
                    )
                  }
                  className="rounded-full bg-white/95 p-3 text-slate-700 shadow-lg backdrop-blur-md transition-all hover:bg-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    activeImageIndex === property.propertyImage.length - 1
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-6 right-6 rounded-full bg-black/80 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                {activeImageIndex + 1} / {property.propertyImage.length}
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 ">
              {property.propertyImage.slice(0, 6).map((image, index) => (
                <button
                  key={image.id}
                  className={`relative aspect-[4/3] w-full overflow-hidden rounded-sm transition-all duration-300 hover:scale-105 ${
                    index === activeImageIndex
                      ? "ring-3 ring-[#0290d1]  ring-offset-2 shadow-lg"
                      : "opacity-70 hover:opacity-100 shadow-md"
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="object-cover"
                    fill
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
              {!session ? (
                <h3 className="text-center text-slate-500 font-medium">
                  Please login to make a reservation
                </h3>
              ) : (
                <>
                  <h3 className="mb-6 text-xl font-bold text-[#0290D1]">
                    Book your stay
                  </h3>

                  <RoomPriceCalendar
                    rooms={availableRooms}
                    onRoomSelect={setSelectedRoomId}
                    selectedRoomId={selectedRoomId}
                    onDateChange={setDateRange}
                    dateRange={dateRange}
                  />

                  <Button
                    size="lg"
                    className="mt-6 w-full bg-gradient-to-r from-[#0290d1] to-[#0290d1] font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-xl py-6"
                    disabled={
                      !selectedRoomId || !dateRange.from || !dateRange.to
                    }
                    onClick={handleBooking}
                  >
                    {selectedRoom ? `Book Now` : "Select Room & Dates"}
                  </Button>
                  {(!selectedRoomId || !dateRange.from || !dateRange.to) && (
                    <p className="mt-3 text-center text-sm text-slate-500">
                      Please select a room and your stay dates
                    </p>
                  )}

                  <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-center">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Available rooms
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-800">
                        {availableRooms.length}
                      </p>
                    </div>

                    <div className="text-center border-x border-slate-200 px-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Max capacity
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-800">
                        {Math.max(
                          ...availableRooms.map((room) => room.guest)
                        )}{" "}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Start From / Night
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-800">
                        {formatPrice(
                          Math.min(...availableRooms.map((room) => room.price))
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div ref={tabsRef}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="p-6 lg:p-8"
          >
            <TabsList className="relative w-full bg-transparent p-0 h-auto overflow-x-auto">
              <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200" />

              <div className="flex w-full min-w-max">
                <TabsTrigger
                  value="description"
                  className="
        relative flex-shrink-0 group/trigger
        px-4 sm:px-6 py-3 sm:py-4
        text-sm sm:text-base font-medium
        text-slate-600 
        bg-transparent border-0 rounded-none
        transition-all duration-300 ease-out
        hover:text-slate-900 hover:bg-slate-50
        data-[state=active]:text-[#0290d1]
        data-[state=active]:font-semibold
        data-[state=active]:bg-blue-50/30
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20
      "
                >
                  <div
                    className="
        absolute bottom-0 left-0 right-0 h-0.5
        bg-gradient-to-r from-[#0290d1] to-blue-600
        transform origin-center transition-transform duration-300
        scale-x-0 data-[state=active]:scale-x-100
      "
                  />
                  <div
                    className="
        absolute bottom-0 left-1/2 right-1/2 h-px
        bg-slate-300 transition-all duration-200
        group-hover/trigger:left-3 group-hover/trigger:right-3
        data-[state=active]:opacity-0
      "
                  />
                  Description
                </TabsTrigger>

                <TabsTrigger
                  value="rooms"
                  className="
        relative flex-shrink-0 group/trigger
        px-4 sm:px-6 py-3 sm:py-4
        text-sm sm:text-base font-medium
        text-slate-600 
        bg-transparent border-0 rounded-none
        transition-all duration-300 ease-out
        hover:text-slate-900 hover:bg-slate-50
        data-[state=active]:text-[#0290d1]
        data-[state=active]:font-semibold
        data-[state=active]:bg-blue-50/30
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20
      "
                >
                  <div
                    className="
        absolute bottom-0 left-0 right-0 h-0.5
        bg-gradient-to-r from-[#0290d1] to-blue-600
        transform origin-center transition-transform duration-300
        scale-x-0 data-[state=active]:scale-x-100
      "
                  />

                  <div
                    className="
        absolute bottom-0 left-1/2 right-1/2 h-px
        bg-slate-300 transition-all duration-200
        group-hover/trigger:left-3 group-hover/trigger:right-3
        data-[state=active]:opacity-0
      "
                  />

                  <span className="whitespace-nowrap">Rooms Availability</span>
                </TabsTrigger>

                <TabsTrigger
                  value="location"
                  className="
        relative flex-shrink-0 group/trigger
        px-4 sm:px-6 py-3 sm:py-4
        text-sm sm:text-base font-medium
        text-slate-600 
        bg-transparent border-0 rounded-none
        transition-all duration-300 ease-out
        hover:text-slate-900 hover:bg-slate-50
        data-[state=active]:text-[#0290d1]
        data-[state=active]:font-semibold
        data-[state=active]:bg-blue-50/30
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20
      "
                >
                  <div
                    className="
        absolute bottom-0 left-0 right-0 h-0.5
        bg-gradient-to-r from-[#0290d1] to-blue-600
        transform origin-center transition-transform duration-300
        scale-x-0 data-[state=active]:scale-x-100
      "
                  />
                  <div
                    className="
        absolute bottom-0 left-1/2 right-1/2 h-px
        bg-slate-300 transition-all duration-200
        group-hover/trigger:left-3 group-hover/trigger:right-3
        data-[state=active]:opacity-0
      "
                  />
                  Location
                </TabsTrigger>
              </div>
            </TabsList>

            <TabsContent value="description" className="mt-8 space-y-8">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-slate-50 p-8 border border-blue-100">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-100 opacity-20"></div>
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-slate-100 opacity-30"></div>

                <div className="relative space-y-6">
                  <div className="space-y-3">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
                      {property.title}
                    </h1>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div
                      className="group flex items-center gap-3 cursor-pointer"
                      onClick={handleShowOnMap}
                    >
                      <div className="bg-blue-100 group-hover:bg-blue-200 rounded-lg p-2 transition-colors">
                        <MapPin className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Location
                        </p>
                        <p className="text-base font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                          {property.location}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:block h-12 w-px bg-slate-300"></div>

                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={
                            property?.tenant?.imageUrl || "/default-avatar.png"
                          }
                          alt={property?.tenant?.name || "Host Avatar"}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-400 border-2 border-white rounded-full h-4 w-4"></div>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Hosted by
                        </p>
                        <p className="text-base font-semibold text-slate-800">
                          {property?.tenant?.name || "Unknown Host"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-xl font-bold text-[#0290d1]">
                        About
                      </h2>
                    </div>

                    <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
                      <p className="text-base leading-7 ">
                        {property.description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <svg
                        className="h-5 w-5 text-emerald-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Property Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 rounded-full p-1">
                          <svg
                            className="h-3 w-3 text-emerald-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          Premium Location
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 rounded-full p-1">
                          <svg
                            className="h-3 w-3 text-emerald-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          Modern Amenities
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 rounded-full p-1">
                          <svg
                            className="h-3 w-3 text-emerald-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          Great Reviews
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 rounded-full p-1">
                          <svg
                            className="h-3 w-3 text-emerald-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          24/7 Support
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Good to Know
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <svg
                          className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-slate-800">
                            Free cancellation
                          </p>
                          <p className="text-slate-600">
                            Cancel up to 24 hours before check-in
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg
                          className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-slate-800">
                            Instant booking
                          </p>
                          <p className="text-slate-600">
                            No waiting for host approval
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg
                          className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-slate-800">
                            Self check-in
                          </p>
                          <p className="text-slate-600">
                            Check yourself in with the keypad
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-amber-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Safety & Security
                    </h3>
                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span>Smoke detector installed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span>First aid kit available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span>Emergency contact provided</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rooms" className="mt-8 space-y-8">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-slate-50 p-6 sm:p-8 border border-blue-100">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-blue-100 opacity-20"></div>
                <div className="absolute bottom-0 left-0 -mb-6 -ml-6 h-24 w-24 rounded-full bg-slate-100 opacity-30"></div>

                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#0290d1]">
                      Available Rooms
                    </h2>
                    <p className="text-slate-600 text-base">
                      Choose from our selection of {availableRooms.length}{" "}
                      comfortable room{availableRooms.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {availableRooms.length}
                      </div>
                      <div className="text-slate-500">Room Types</div>
                    </div>
                  </div>
                </div>
              </div>

              {availableRooms.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {availableRooms.map((room, index) => (
                      <div
                        key={room.id}
                        className="group transform transition-all duration-300 hover:-translate-y-2"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <PropertyDetailCard
                          roomId={room.id}
                          name={room.type}
                          imageUrl={
                            room.roomImage[0]?.imageUrl ||
                            "/placeholder-room.jpg"
                          }
                          guest={room.guest}
                          price={room.price}
                          roomFacilities={room.roomFacility.filter(
                            (f) => !f.isDeleted
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                      <div className="flex items-start gap-3">
                        <div className="bg-emerald-100 rounded-lg p-2 flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-emerald-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-3">
                            Booking Tips
                          </h3>
                          <ul className="space-y-2 text-sm text-slate-700">
                            <li className="flex items-start gap-2">
                              <svg
                                className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Book early for better rates and availability
                            </li>
                            <li className="flex items-start gap-2">
                              <svg
                                className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Check our flexible cancellation policy
                            </li>
                            <li className="flex items-start gap-2">
                              <svg
                                className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Contact us for group bookings and discounts
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-3">
                            Shared Amenities
                          </h3>
                          <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span>Free WiFi</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span>Parking</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span>24/7 Front Desk</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span>Housekeeping</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="mx-auto max-w-md">
                    <div className="bg-slate-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                      <svg
                        className="h-12 w-12 text-slate-400 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No Rooms Available
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Unfortunately, there are no rooms available at the moment.
                      Please check back later or contact us for updates.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
                        Contact Property
                      </button>
                      <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-6 rounded-lg transition-colors">
                        View Similar Properties
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="location" className="mt-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-[#0290d1]">
                    Property Location
                  </h2>
                  <p className="text-slate-600">
                    Explore the area and nearby attractions
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{property.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  <div
                    ref={mapSectionRef}
                    className={`
          relative group h-[450px] overflow-hidden 
          rounded-2xl transition-all duration-500 
          ${
            highlightMap
              ? "shadow-2xl shadow-blue-500/30 ring-4 ring-blue-500 ring-opacity-50 scale-[1.02]"
              : "shadow-lg hover:shadow-xl"
          }
        `}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100 animate-pulse z-0">
                      <div className="flex items-center justify-center h-full">
                        <div className="flex items-center gap-3 text-slate-500">
                          <svg
                            className="animate-spin h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span className="font-medium">Loading map...</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 h-full w-full">
                      <Map
                        selectedPosition={[
                          property.latitude,
                          property.longitude,
                        ]}
                        onPositionChange={handlePositionChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          About the Area
                        </h3>
                        <p className="text-slate-700 leading-relaxed">
                          This property is located in{" "}
                          <span className="font-semibold text-blue-700">
                            {property.location}
                          </span>
                          . The area is known for its beautiful scenery and
                          accessibility to local attractions, making it an ideal
                          destination for travelers seeking both convenience and
                          natural beauty.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-emerald-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Location Highlights
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 rounded-full p-1">
                          <svg
                            className="h-3 w-3 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-700">
                          Prime location with easy access
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 rounded-full p-1">
                          <svg
                            className="h-3 w-3 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-700">
                          Close to local attractions
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 rounded-full p-1">
                          <svg
                            className="h-3 w-3 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-700">
                          Beautiful scenic surroundings
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 rounded-full p-1">
                          <svg
                            className="h-3 w-3 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-700">
                          Great transportation links
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Additional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Check-in:</span> After 2:00
                      PM
                    </p>
                    <p>
                      <span className="font-medium">Check-out:</span> Before
                      12:00 PM
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Parking:</span> Available
                      on-site
                    </p>
                    <p>
                      <span className="font-medium">Languages:</span> English,
                      Indonesian
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </main>
  );
}
