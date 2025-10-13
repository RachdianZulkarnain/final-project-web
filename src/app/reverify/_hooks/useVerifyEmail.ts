"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { verifyEmail } from "../_api/verifyEmail";

export const useVerifyEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),

    onSuccess: () => {
      toast.success("Your email has been verified.");
      router.push("/profile");
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || error.message || "Verification failed."
      );
      console.error("Verify email error:", error);
    },
  });
};
