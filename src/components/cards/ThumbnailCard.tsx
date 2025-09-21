"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface IThumbnailCard {
  redirectUrl: string;
  imageUrl: string;
  hoverAnim?: boolean;
  text?: string;
}

export const ThumbnailCard = ({
  redirectUrl,
  imageUrl,
  hoverAnim,
  text,
}: IThumbnailCard) => {
  const [loading, setLoading] = useState(true);

  return (
    <Link href={redirectUrl}>
      <motion.div
        className="group relative aspect-[3/2] w-full overflow-hidden rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={hoverAnim ? { scale: 1.03 } : {}}
      >
        {loading && (
          <Skeleton className="absolute inset-0 h-full w-full rounded-xl" />
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full"
        >
          <Image
            src={imageUrl}
            alt="Destination"
            fill
            unoptimized
            onLoadingComplete={() => setLoading(false)}
            className={`object-cover transition-transform duration-500 ease-in-out 
              ${hoverAnim ? "group-hover:scale-110" : ""}`}
          />
        </motion.div>

        {text && !loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-white text-2xl font-semibold drop-shadow-md">
              {text}
            </span>
          </motion.div>
        )}
      </motion.div>
    </Link>
  );
};
