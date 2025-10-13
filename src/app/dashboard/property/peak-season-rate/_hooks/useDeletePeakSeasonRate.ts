"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { deletePeakSeasonRate } from "../_api/deletePeekSeasonRate";

export const useDeletePeakSeasonRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePeakSeasonRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["peakSeasonRate"] });
      toast.success("Peak Season Rate deleted successfully");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "Failed to delete Peak Season Rate"
      );
    },
  });
};
