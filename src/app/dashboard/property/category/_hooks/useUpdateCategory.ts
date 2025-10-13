"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { updateCategory, UpdateCategoryPayload } from "../_api/updateCategory";

const useUpdateCategory = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCategoryPayload) =>
      updateCategory(axiosInstance, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorylist"] });
      toast.success("Update Category success");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });
};

export default useUpdateCategory;
