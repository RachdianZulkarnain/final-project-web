"use client";

import { axiosInstance } from "@/lib/axios";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRoomNonAvailabilityPayload) => {
      const payloadToSend = {
        ...payload,
        startDate: payload.startDate.toISOString(),
        endDate: payload.endDate.toISOString(),
      };

      const { data } = await axiosInstance.post(
        "/room-non-availabilities",
        payloadToSend
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomNonAvailabilities"] });
      toast.success("Room Non Availability created successfully");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to create Room Non Availability"
      );
    },
  });
};

export default useCreateRoomNonAvailability;
