import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  resendEmailVerif,
  ResendEmailVerifPayload,
} from "../_api/resendEmailVerif";

const useResendEmailVerif = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ResendEmailVerifPayload) => resendEmailVerif(payload),
    onSuccess: () => {
      toast.success("Please check your email to verify");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
      console.error("Resend email verification error:", error);
    },
  });
};

export default useResendEmailVerif;
