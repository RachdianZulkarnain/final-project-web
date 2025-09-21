"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { motion } from "framer-motion";

interface PropertyCardProps {
  imageUrl?: string;
  title: string;
  rating?: number;
  id: number;
}

const PropertyTenantCard: FC<PropertyCardProps> = ({ imageUrl, title, id }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      whileHover={{ scale: 1.03, y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <Card className="relative pt-0 transition-shadow duration-200 hover:shadow-lg rounded-xl overflow-hidden">
        <Link href={`/dashboard/property/management/${id}`}>
          <CardHeader className="p-0">
            <div className="relative h-[225px] w-full overflow-hidden rounded-t-lg">
              <Image
                src={imageUrl || "/placeholder-property.jpg"}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                priority
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="line-clamp-1 text-base">{title}</CardTitle>
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
};

export default PropertyTenantCard;
