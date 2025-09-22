"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useDeleteProperty = () => {
  const router = useRouter();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/properties/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
      toast.success("Delete Property success");
      router.push("/dashboard/property");
    },
    onError: (error: AxiosError<any>) => {
      const errData = error.response?.data;
      const errorMessage =
        typeof errData === "string"
          ? errData
          : errData?.message || "Delete Property failed";

      toast.error(errorMessage);
    },
  });
};

export default useDeleteProperty;
