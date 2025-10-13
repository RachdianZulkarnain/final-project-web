"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProperty, CreatePropertyPayload } from "../_api/createProperty";

const useCreateProperty = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePropertyPayload) => createProperty(payload),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
      toast.success("Create property success");
      router.push("/dashboard/property");
    },

    onError: (error: AxiosError<any>) => {
      console.error("❌ Create property error:", error.response?.data);
      toast.error(error.response?.data?.message || "Create property failed");
    },
  });
};

export default useCreateProperty;
