"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdateTenantPayload {
  name?: string;
  phone?: string;
  bankName?: string;
  bankNumber?: string;
  imageFile?: File | null;
}

export const useUpdateTenant = () => {
  const router = useRouter();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateTenantPayload) => {
      const updateTenantForm = new FormData();

      if (payload.name) updateTenantForm.append("name", payload.name);
      if (payload.phone) updateTenantForm.append("phone", payload.phone);
      if (payload.bankName)
        updateTenantForm.append("bankName", payload.bankName);
      if (payload.bankNumber)
        updateTenantForm.append("bankNumber", payload.bankNumber);
      if (payload.imageFile)
        updateTenantForm.append("imageFile", payload.imageFile);

      const { data } = await axiosInstance.patch(
        "/account/tenant",
        updateTenantForm
      );
      return data;
    },
    onSuccess: async () => {
      toast.success("Tenant profile updated successfully");

      await queryClient.invalidateQueries({ queryKey: ["tenant"] });
      router.push("/tenant/dashboard/account");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message ||
          error.response?.data ||
          "Failed to update tenant profile"
      );
    },
  });
};
