"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutAfterProfileUpdate, updateProfile } from "../_api/updateProfile";

export const useUpdateProfile = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      toast.success("Update profile success");
      await queryClient.invalidateQueries({ queryKey: ["account"] });

      try {
        await logoutAfterProfileUpdate();
        localStorage.removeItem("token");
        sessionStorage.clear();
        router.push("/login");
      } catch {
        router.push("/user/dashboard/account");
      }
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};
