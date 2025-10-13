import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePassword, ChangePasswordPayload } from "../_api/changePassword";

const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: () => {
      toast.success("Password has been successfully changed");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
      console.error(error);
    },
  });
};

export default useChangePassword;
