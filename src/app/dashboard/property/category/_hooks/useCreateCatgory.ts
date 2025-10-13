"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { createCategory, CreateCategoryPayload } from "../_api/createCategory";

const useCreateCategory = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      createCategory(axiosInstance, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorylist"] });
      toast.success("Create Category success");
    },
    onError: (error: AxiosError<any>) => {
      console.error("❌ Backend error:", error.response?.data);
      toast.error(error.response?.data?.message || "Create failed");
    },
  });
};

export default useCreateCategory;
