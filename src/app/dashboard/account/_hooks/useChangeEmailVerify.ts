"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  verifyChangeEmail,
  VerifyChangeEmailPayload,
} from "../_api/verifyChangeEmail";

export const useVerifyChangeEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: VerifyChangeEmailPayload) =>
      verifyChangeEmail(payload),
    onSuccess: () => {
      toast.success("Email changed successfully");
      router.push("/login");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "Failed to verify email change"
      );
    },
  });
};
