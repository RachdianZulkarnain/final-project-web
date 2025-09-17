"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetPropertiesTenant } from "@/hooks/api/property/useGetPropertiesTenant";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyTenantCard from "@/components/PropertyTenantCard";
import Pagination from "@/components/PaginationSection";

// Tipe data API-safe
interface PropertyTenant {
  id: number;
  title: string;
  propertyImage: { imageUrl?: string }[];
}

const PropertyTenantList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const { data, isPending, error } = useGetPropertiesTenant({
    page,
    take: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Sync page dengan URL
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
  }, [page, searchParams, router]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load properties. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className="h-[300px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl py-8">
        <div className="text-center">
          <h5 className="text-lg font-medium text-gray-600">
            No properties found
          </h5>
          <p className="mt-2 text-gray-500">
            Start by creating your first property
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data.data.map((property: PropertyTenant) => (
          <PropertyTenantCard
            key={property.id}
            id={property.id}
            imageUrl={property.propertyImage?.[0]?.imageUrl || ""}
            title={property.title}
          />
        ))}
      </div>

      {/* Pagination */}
      {data.meta && data.meta.total > data.meta.take && (
        <div className="flex justify-center mt-4">
          <Pagination
            page={page}
            take={data.meta.take}
            total={data.meta.total}
            onChangePage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default PropertyTenantList;
