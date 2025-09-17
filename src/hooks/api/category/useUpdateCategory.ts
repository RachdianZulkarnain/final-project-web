"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface UpdateCategoryPayload {
  id: number;
  name: string;
}

const useUpdateCategory = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateCategoryPayload) => {
      const { data } = await axiosInstance.put(`/categories/${payload.id}`, {
        name: payload.name,
      });
      return data;
    },
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
