"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProperty, UpdatePropertyPayload } from "../_api/updateProperty";

const useUpdateProperty = (id: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  useAxios(); // memastikan interceptor/token aktif

  return useMutation({
    mutationFn: (payload: UpdatePropertyPayload) => updateProperty(id, payload),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
      toast.success("Update property success");
      router.push("/dashboard/property");
    },
    onError: (error: AxiosError<any>) => {
      const message =
        error?.response?.data?.message || "Failed to update property";
      toast.error(message);
    },
  });
};

export default useUpdateProperty;
