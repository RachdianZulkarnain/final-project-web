import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { uploadProfilePic } from "../_api/uploadProfilePic";

const useUploadProfilePic = (userId: number) => {
  const queryClient = useQueryClient();
  const { update, data: session } = useSession();

  return useMutation({
    mutationFn: (payload: FormData) => uploadProfilePic(userId, payload),

    onSuccess: async (data) => {
      toast.success("Profile picture updated successfully!");

      await update({
        ...session,
        user: {
          ...session?.user,
          profilePic: data.profilePic,
        },
      });

      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },

    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";

      toast.error(errorMessage);
      console.error("Upload profile picture error:", error);
    },
  });
};

export default useUploadProfilePic;
