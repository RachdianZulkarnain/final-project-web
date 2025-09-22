// useCreateRoomNonAvailability.ts
"use client";

import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface CreateRoomNonAvailabilityPayload {
  reason: string;
  startDate: Date;
  endDate: Date;
  roomId: number;
}

const useCreateRoomNonAvailability = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (payload: CreateRoomNonAvailabilityPayload) => {
      if (!session?.user?.accessToken) {
        toast.error("You must login before creating room non availability");
        throw new Error("Unauthorized: no token in session");
      }

      const payloadToSend = {
        ...payload,
        startDate: payload.startDate.toISOString(),
        endDate: payload.endDate.toISOString(),
      };

      const { data } = await axiosInstance.post(
        "/room-non-availabilities",
        payloadToSend,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomNonAvailabilities"] });
      toast.success("Room Non Availability created successfully");
    },
    onError: (error: any) => {
      console.error("❌ RoomNonAvailability Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
};

export default useCreateRoomNonAvailability;
