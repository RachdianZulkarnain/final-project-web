import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setPassword } from "../_api/setPassword";

export const useSetPassword = (token: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (password: string) => setPassword(password, token),
    onSuccess: () => {
      toast.success("Password set successfully! You can now log in.");
      router.push("/sign-in");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to set password. Please try again."
      );
      console.error("Set password error:", error);
    },
  });
};
