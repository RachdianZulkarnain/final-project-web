import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import { updateUser, UpdateUserPayload } from "../_api/updateUser";

const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(userId, payload),
    onSuccess: async () => {
      toast.success("User data updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      await getSession(); // refresh session data setelah update user
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update user";
      toast.error(message);
      console.error("Update user error:", error);
    },
  });
};

export default useUpdateUser;
