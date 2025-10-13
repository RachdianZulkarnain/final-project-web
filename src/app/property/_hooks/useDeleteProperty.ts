"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { deleteProperty } from "../_api/deleteProperty";

const useDeleteProperty = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProperty(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
      toast.success("Delete property success");
      router.push("/dashboard/property");
    },

    onError: (error: AxiosError<any>) => {
      const errData = error.response?.data;
      const errorMessage =
        typeof errData === "string"
          ? errData
          : errData?.message || "Delete property failed";

      toast.error(errorMessage);
      console.error("❌ Delete property error:", error);
    },
  });
};

export default useDeleteProperty;
