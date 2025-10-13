import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { register, RegisterPayload } from "../_api/register";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: () => {
      toast.success(
        "Registration successful! Please check your email to verify and set your password."
      );
      router.push("/sign-up/verification");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Failed to register.");
      console.error("Registration Error:", error);
    },
  });
};
