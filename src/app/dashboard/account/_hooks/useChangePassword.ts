"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { changePassword, ChangePasswordPayload } from "../_api/changePassword";

export const useChangePassword = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["changePassword"],
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: () => {
      toast.success("Change password success");
      router.push("/tenant/dashboard/account");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Change password failed");
    },
  });
};
