import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export interface RegisterPayload {
  email: string;
  firstName: string;
  lastName: string;
}

const useRegisterTenant = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      // Pastikan frontend sudah validasi password === confirmPassword sebelum kirim
      const { data } = await axiosInstance.post(
        "/auth/register-tenant",
        payload
      );
      return data;
    },
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

export default useRegisterTenant;
