"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface CreateRoomNonAvailabilityPayload {
  reason: string;
  startDate: Date;
  endDate: Date;
  roomId: number;
}

const useCreateRoomNonAvailability = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRoomNonAvailabilityPayload) => {
      if (typeof window === "undefined") {
        throw new Error("Client-side only");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to perform this action");
        return Promise.reject("Unauthorized: token not found");
      }

      const payloadToSend = {
        ...payload,
        startDate: payload.startDate.toISOString(),
        endDate: payload.endDate.toISOString(),
      };

      try {
        const { data } = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/room-non-availabilities`,
          payloadToSend,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return data;
      } catch (err: any) {
        console.error("API Error:", err.response || err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomNonAvailabilities"] });
      toast.success("Room Non Availability created successfully");
    },
    onError: (error: AxiosError<any>) => {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
            error.message ||
            "Something went wrong";
      toast.error(message);
    },
  });
};

export default useCreateRoomNonAvailability;
