"use client";

import { RoomFacility } from "@/types/property";
import { User2 } from "lucide-react";
import Image from "next/image";
import { FaSquareCheck } from "react-icons/fa6";
import { Card, CardHeader } from "./ui/card";

interface PropertyDetailCardProps {
  roomId: number;
  name: string;
  imageUrl: string;
  roomFacilities: RoomFacility[];
  price: number;
  guest: number;
  transactionId?: number;
}

const PropertyDetailCard = ({
  roomId,
  name,
  imageUrl,
  roomFacilities,
  price,
  guest,
  transactionId,
}: PropertyDetailCardProps) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="mt-5 overflow-hidden shadow-lg pt-0 transition-shadow duration-300 hover:shadow-xl md:mt-0">
      <div className="relative h-[300px] overflow-hidden">
        <Image
          src={imageUrl || "/placeholder-room.jpg"}
          alt={`${name} room image`}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <CardHeader className="p-6">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <RoomInfo name={name} guest={guest} />
            <PriceInfo price={formatPrice(price)} />
          </div>

          <div className="border-t pt-6">
            <FacilitiesList facilities={roomFacilities} />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

const RoomInfo = ({ name, guest }: { name: string; guest: number }) => (
  <div className="space-y-2">
    <h4 className="text-xl font-bold text-[#0290d1] md:text-left text-center">
      {name}
    </h4>
    <div className="flex items-center justify-center md:justify-start gap-2">
      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
        <User2 className="mr-2 h-4 w-4" /> {guest}{" "}
        {guest === 1 ? "Guest" : "Guests"}
      </span>
    </div>
  </div>
);

const PriceInfo = ({ price }: { price: string }) => (
  <div className="space-y-2 md:text-right text-center">
    <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
      Price per night
    </h4>
    <div className="space-y-1">
      <p className="text-2xl font-bold text-[#0290d1]">{price}</p>
      <p className="text-xs text-gray-500">Taxes and fees included</p>
    </div>
  </div>
);

const FacilitiesList = ({ facilities }: { facilities: RoomFacility[] }) => (
  <div className="space-y-4">
    <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
      <span className="h-1 w-8 bg-[#0290d1] rounded"></span>
      Room Facilities
    </h5>

    {facilities.length > 0 ? (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {facilities.map((facility) => (
          <FacilityItem key={facility.id} facility={facility} />
        ))}
      </div>
    ) : (
      <p className="text-gray-500 italic">
        No facilities information available
      </p>
    )}
  </div>
);

const FacilityItem = ({ facility }: { facility: RoomFacility }) => (
  <div className="group rounded-lg border border-gray-100 p-4 transition-all duration-200 hover:border-[#0290d1] hover:shadow-sm">
    <div className="flex items-start gap-3">
      <FaSquareCheck className="mt-0.5 flex-shrink-0 text-[#0290d1] transition-colors group-hover:text-blue-600" />
      <div className="min-w-0 flex-1 space-y-1">
        <h6 className="font-medium text-gray-800 group-hover:text-[#0290d1] transition-colors">
          {facility.title}
        </h6>
        {facility.description && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {facility.description}
          </p>
        )}
      </div>
    </div>
  </div>
);

export default PropertyDetailCard;
