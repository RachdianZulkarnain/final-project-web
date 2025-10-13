"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { changeEmail, ChangeEmailPayload } from "../_api/changeEmail";

export const useChangeEmail = () => {
  return useMutation({
    mutationFn: (payload: ChangeEmailPayload) => changeEmail(payload),
    onSuccess: () => {
      toast.success("Verification email sent. Please check your email.");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Failed to change email");
    },
  });
};
