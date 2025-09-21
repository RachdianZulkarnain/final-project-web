"use client";

import { ThumbnailCard } from "@/components/cards/ThumbnailCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const ExploreCity = () => {
  const [loading, setLoading] = useState(true);

  const cities = [
    { name: "Bali", image: "/assets/Bali.webp" },
    { name: "Makassar", image: "/assets/Makassar.webp" },
    { name: "Magelang", image: "/assets/Magelang.webp" },
    { name: "Semarang", image: "/assets/Semarang.webp" },
    { name: "Surabaya", image: "/assets/Surabaya.webp" },
    { name: "Bandung", image: "/assets/Bandung.webp" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h2 className="text-4xl text-[#0290d1] font-bold pb-8">
        Explore Indonesia
      </h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="overflow-hidden rounded-xl shadow-sm p-0"
              >
                <Skeleton className="h-[200px] w-full rounded-xl" />
              </Card>
            ))
          : cities.map((x, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.04, y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  duration: 0.35,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <Card className="overflow-hidden pt-0 pb-0 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <ThumbnailCard
                    redirectUrl={`/property-catalog?location=${encodeURIComponent(
                      x.name
                    )}`}
                    imageUrl={x.image}
                    hoverAnim={true}
                    text={x.name}
                  />
                </Card>
              </motion.div>
            ))}
      </div>
    </div>
  );
};
