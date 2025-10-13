"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  updateRoomNonAvailability,
  UpdateRoomNonAvailabilityPayload,
} from "../_api/updateRoomNonAvailability";

const useUpdateRoomNonAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRoomNonAvailabilityPayload) =>
      updateRoomNonAvailability(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomNonAvailabilities"] });
      toast.success("Update Room Non Availability Success");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data || "Failed to update Room Non Availability"
      );
    },
  });
};

export default useUpdateRoomNonAvailability;
