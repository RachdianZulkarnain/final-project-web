"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { deleteCategory } from "../_api/deleteCategory";

const useDeleteCategory = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(axiosInstance, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorylist"] });
      toast.success("Delete Category success");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Delete failed");
    },
  });
};

export default useDeleteCategory;
