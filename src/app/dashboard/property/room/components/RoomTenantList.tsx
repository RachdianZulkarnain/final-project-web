"use client";
import Pagination from "@/components/PaginationSection";
import RoomCard from "@/components/RoomTenantCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoomsTenant } from "@/hooks/api/room/useGetRoomsTenant";
import { useSession } from "next-auth/react";
import { useState } from "react";

const RoomTenantList = () => {
  const session = useSession();
  const [page, setPage] = useState(1);
  const { data, isPending, error } = useGetRoomsTenant({
    page,
    take: 4,
    propertyId: session.data?.user.id,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load rooms. Please try again.
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
          <h5 className="text-lg font-medium text-gray-600">No rooms found</h5>
          <p className="mt-2 text-gray-500">
            Start by creating your first room
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data.data.map((room) => (
          <RoomCard
            key={room.id}
            id={room.id}
            guest={room.guest}
            imageUrl={room.roomImage?.[0]?.imageUrl || ""}
            name={room.name || room.type}
            stock={room.stock}
            price={room.price}
            propertyTitle={room.property.title}
            type={room.type}
          />
        ))}
      </div>

      {data.meta && (
        <div className="mt-10 flex justify-center text-[#0290d1]">
          <Pagination
            take={data.meta.take}
            total={data.meta.total}
            page={page}
            onChangePage={handlePageChange}
          />
        </div>
      )}
    </section>
  );
};

export default RoomTenantList;
