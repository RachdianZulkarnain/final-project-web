"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { forgotPassword, ForgotPasswordPayload } from "../_api/forgotPassword";

export const useForgotPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),

    onSuccess: () => {
      toast.success("Please check your email to reset password.");
      router.push("/sign-in");
    },

    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
      console.error("Forgot password error:", error);
    },
  });
};
