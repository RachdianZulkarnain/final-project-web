"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateTenant } from "../_api/updateTenant";

export const useUpdateTenant = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTenant,
    onSuccess: async () => {
      toast.success("Tenant profile updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["tenant"] });
      router.push("/tenant/dashboard/account");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to update tenant profile"
      );
    },
  });
};
