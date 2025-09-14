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
import {
  Building2,
  Heart,
  MapPin,
  Plane,
  Share,
  ShoppingCart,
  Umbrella,
  User,
  Utensils,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { RoomPriceCalendar } from "./components/RoomPriceCalendar";
import PropertyDetailCard from "../PropertyDetailCard";
import { useSession } from "next-auth/react";

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
          {/* Left Section */}
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

          {/* Right Section */}
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
    <main className="mx-auto my-8 max-w-screen-2xl px-4 sm:my-12 sm:px-6">
      <div className="mb-6 text-sm text-slate-500">
        <span className="hover:text-[#0290d1] hover:underline transition-colors cursor-pointer">
          Properties
        </span>
        <span className="mx-2 text-slate-300">›</span>
        <span className="text-slate-700 font-medium">{property.title}</span>
      </div>

      <Card className="overflow-hidden border-0 bg-white shadow-xl shadow-slate-200/50 rounded-3xl">
        <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-3 lg:p-8">
          <div className="space-y-6 lg:col-span-2">
            <div className="group relative h-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 sm:h-[500px] shadow-lg">
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

            <div className="grid grid-cols-6 gap-3">
              {property.propertyImage.slice(0, 6).map((image, index) => (
                <button
                  key={image.id}
                  className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 ${
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

          {/* Booking Section */}
          <div>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
              {!session ? (
                <h3 className="text-center text-slate-500 font-medium">
                  Please login as Tenant to make a reservation
                </h3>
              ) : (
                <>
                  <h3 className="mb-6 text-xl font-bold text-slate-900">
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
                    {/* Available rooms */}
                    <div className="text-center">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Available rooms
                      </p>
                      <p className="mt-2 text-xl font-semibold text-slate-800">
                        {availableRooms.length}
                      </p>
                    </div>

                    {/* Max capacity */}
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

                    {/* Price from */}
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
            <TabsList className="w-full justify-start gap-8 border-b bg-transparent p-0 h-auto">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-3 border-transparent px-2 py-4 text-base font-semibold data-[state=active]:border-[#0290d1]  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#0290d1]  transition-all"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="rooms"
                className="rounded-none border-b-3 border-transparent px-2 py-4 text-base font-semibold data-[state=active]:border-[#0290d1]  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#0290d1]  transition-all"
              >
                Rooms Availability
              </TabsTrigger>

              <TabsTrigger
                value="location"
                className="rounded-none border-b-3 border-transparent px-2 py-4 text-base font-semibold data-[state=active]:border-[#0290d1]  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#0290d1]  transition-all"
              >
                Location
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl leading-tight">
                  {property.title}
                </h1>

                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin
                    onClick={handleShowOnMap}
                    className="h-5 w-5 cursor-pointer text-[#0290d1] transition-all hover:text-blue-700"
                  />
                  <span className="text-base">{property.location}</span>
                </div>

                <div className="flex items-center gap-3  text-slate-600">
                  <span className="text-base">Hosted by</span>
                  <span className=" font-semibold text-slate-800">
                    {property.tenant.name}
                  </span>
                </div>
              </div>
              <div className="mt-5 prose prose-lg max-w-none text-slate-700 leading-relaxed">
                <p>{property.description}</p>
              </div>
            </TabsContent>

            <TabsContent value="rooms" className="mt-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {availableRooms.map((room) => (
                  <PropertyDetailCard
                    key={room.id}
                    roomId={room.id}
                    name={room.type}
                    imageUrl={
                      room.roomImage[0]?.imageUrl || "/placeholder-room.jpg"
                    }
                    guest={room.guest}
                    price={room.price}
                    roomFacilities={room.roomFacility.filter(
                      (f) => !f.isDeleted
                    )}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="location" className="mt-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div
                  ref={mapSectionRef}
                  className={`h-[450px] overflow-hidden rounded-2xl transition-all duration-500 lg:col-span-2 ${
                    highlightMap
                      ? "shadow-2xl shadow-blue-500/30 ring-4 ring-blue-500 ring-opacity-50"
                      : "shadow-lg"
                  }`}
                >
                  <Map
                    selectedPosition={[property.latitude, property.longitude]}
                    onPositionChange={handlePositionChange}
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-[#0290d1]">
                      About the area
                    </h3>
                    <p className="text-base text-slate-700 leading-relaxed">
                      This property is located in {property.location}. The area
                      is known for its beautiful scenery and accessibility to
                      local attractions.
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
