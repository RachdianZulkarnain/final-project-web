"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  updatePeakSeasonRate,
  UpdatePeakSeasonRatePayload,
} from "../_api/updatePeekSeasonRate";

export const useUpdatePeakSeasonRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePeakSeasonRatePayload) =>
      updatePeakSeasonRate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["peakSeasonRate"] });
      toast.success("Peak Season Rate updated successfully");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "Failed to update Peak Season Rate"
      );
    },
  });
};
