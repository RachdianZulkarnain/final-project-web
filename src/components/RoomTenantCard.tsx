"use client";

import { Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Card, CardHeader } from "./ui/card";
import { motion } from "framer-motion";

interface RoomCardProps {
  id: number;
  name: string;
  stock: number;
  price: number;
  guest: number;
  imageUrl: string;
  propertyTitle: string;
  type: string;
}

const RoomCard: FC<RoomCardProps> = ({
  id,
  name,
  stock,
  price,
  guest,
  imageUrl,
  propertyTitle,
  type,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group"
    >
      <Card className="relative pt-0 transition-shadow duration-200 hover:shadow-lg rounded-xl overflow-hidden">
        <Link href={`/dashboard/property/room/${id}`}>
          <CardHeader className="p-0 relative">
            <div className="absolute left-4 top-4 z-10">
              <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span>{propertyTitle}</span>
              </div>
            </div>

            <div className="relative h-80 overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Image
                src={imageUrl || "/placeholder-room.jpg"}
                alt={`${type} Room at ${propertyTitle}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 space-y-1 text-white  opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-sm font-medium">{type} Room</p>
                <h4 className="text-lg font-semibold">{name}</h4>
              </div>
            </div>
          </CardHeader>

          <CardHeader className="px-6 pt-6 pb-6 space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <h4 className="text-center text-sm font-medium text-gray-600 mb-1">
                Price per night
              </h4>
              <p className="text-center text-xl font-semibold text-blue-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(price)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Capacity</p>
                <p className="font-medium">{guest} people</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Available</p>
                <p className="font-medium">{stock} Rooms</p>
              </div>
            </div>
          </CardHeader>
        </Link>
      </Card>
    </motion.div>
  );
};

export default RoomCard;
