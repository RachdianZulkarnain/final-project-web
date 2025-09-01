"use client";

import React from "react";
import Loading from "@/app/loading";
import { useSearchParams } from "next/navigation";
import PropertyPage from "@/components/product_detail/PropertyPage";
import { useGetListingById } from "@/components/listings/hooks/useGetListings";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function Page({ params }: PageProps) {
  // Gunakan React.use() untuk unwrap params
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  const slugParts = slug.split("-");
  const id = slugParts[slugParts.length - 1];

  const queryParams = useSearchParams();
  const startDate = queryParams.get("start_date") || "";
  const endDate = queryParams.get("end_date") || "";
  const adults = queryParams.get("adults") || "";
  const kids = queryParams.get("children") || "";

  const { listingById } = useGetListingById({ id });

  if (!listingById) return <Loading />;

  const { sample, imageCollection } = listingById;

  return (
    <PropertyPage
      startDate={startDate}
      endDate={endDate}
      adults={adults}
      kids={kids}
      data={sample}
      imageCollection={imageCollection}
    />
  );
}
