"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  createRoomNonAvailability,
  CreateRoomNonAvailabilityPayload,
} from "../_api/createRoomNonAvailability";

const useCreateRoomNonAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoomNonAvailabilityPayload) =>
      createRoomNonAvailability(payload),
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
