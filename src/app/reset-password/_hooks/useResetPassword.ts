import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetPassword } from "../_api/resetPassword";

export const useResetPassword = (token: string | null) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (newPassword: string) => {
      if (!token) throw new Error("Reset token is missing");
      return resetPassword(token, newPassword);
    },

    onSuccess: () => {
      toast.success("Password reset successfully. You can now log in.");
      router.push("/sign-in");
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong.";
      toast.error(message);
    },
  });
};
