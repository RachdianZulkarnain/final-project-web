"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { deleteRoomNonAvailability } from "../_api/deleteRoomNonAvailability";

const useDeleteRoomNonAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRoomNonAvailability(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomNonAvailabilities"] });
      toast.success("Delete Room Non Availability Success");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data || "Failed to delete Room Non Availability"
      );
    },
  });
};

export default useDeleteRoomNonAvailability;
