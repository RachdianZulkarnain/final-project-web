import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { markAllNotif } from "../_api/markAllNotif";

const useMarkAllNotif = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotif(),
    onSuccess: async () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to mark notifications";
      toast.error(message);
      console.error("Mark all notif error:", error);
    },
  });
};

export default useMarkAllNotif;
