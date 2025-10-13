"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  createPeakSeasonRate,
  PeakSeasonRatePayload,
} from "../_api/createPeekSeasonRate";

export const useCreatePeakSeasonRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PeakSeasonRatePayload) =>
      createPeakSeasonRate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["peakSeasonRate"] });
      toast.success("Peak Season Rate created successfully");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "Failed to create Peak Season Rate"
      );
    },
  });
};
