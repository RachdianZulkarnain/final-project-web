"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface CreateCategoryPayload {
  name: string;
  userId: number;
}

const useCreateCategory = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCategoryPayload) => {
      console.log("📦 Payload ke backend:", payload);
      const { data } = await axiosInstance.post("/categories", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorylist"] });
      toast.success("✅ Create Category success");
    },
    onError: (error: AxiosError<any>) => {
      console.error("❌ Backend error:", error.response?.data);
      toast.error(error.response?.data?.message || "Create failed");
    },
  });
};

export default useCreateCategory;
