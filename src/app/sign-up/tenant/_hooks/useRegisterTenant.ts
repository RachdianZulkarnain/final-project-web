import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerTenant, RegisterPayload } from "../_api/registerTenant";

export const useRegisterTenant = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerTenant(payload),
    onSuccess: () => {
      toast.success(
        "Registration successful! Please check your email to verify and set your password."
      );
      router.push("/sign-up/verification");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Registration failed!");
      console.error("Registration Error:", error);
    },
  });
};
