import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string; // wajib sesuai DTO backend
}

const useChangePassword = () => {
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      // pastikan payload sesuai DTO backend
      const { data } = await axiosInstance.patch(
        "/auth/change-password",
        payload
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Password has been successfully changed");
    },
    onError: (error: any) => {
      // ambil message dari response backend
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
      console.error(error);
    },
  });
};

export default useChangePassword;
