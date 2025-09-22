// useCreateRoomNonAvailability.ts
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
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: token not found");

      const payloadToSend = {
        ...payload,
        startDate: payload.startDate.toISOString(),
        endDate: payload.endDate.toISOString(),
      };

      const { data } = await axiosInstance.post(
        "/room-non-availabilities",
        payloadToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomNonAvailabilities"] });
      toast.success("Room Non Availability created successfully");
    },
    onError: (error: AxiosError<any>) => {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
};

export default useCreateRoomNonAvailability;
