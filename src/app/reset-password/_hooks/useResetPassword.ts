import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useResetPassword = (token: string) => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (newPassword: string) => {
      if (!token) throw new Error("Reset token is missing");

      const { data } = await axiosInstance.post(
        `/auth/reset-password?token=${token}`,
        { newPassword }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Password reset successfully. You can now log in");
      router.push("/sign-in");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(message);
    },
  });
};


export default useResetPassword;
