"use client";

import { axiosInstance } from "@/lib/axios"; // pastikan baseURL nya absolute, bukan relative
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useDeleteProperty = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (typeof window === "undefined") throw new Error("No window context");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: token not found");

      const { data } = await axiosInstance.delete(`/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
      toast.success("Delete Property success");
      router.push("/dashboard/property");
    },
    onError: (error: AxiosError<any>) => {
      console.error("❌ Delete Property Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

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
