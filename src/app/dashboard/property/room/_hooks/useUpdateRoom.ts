"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateRoom, UpdateRoomPayload } from "../_api/updateRoom";

const useUpdateRoom = (id: number) => {
  const router = useRouter();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRoomPayload) =>
      updateRoom(axiosInstance, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
      toast.success("Update room success");
      router.push("/dashboard/property");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data || "Update room failed";
      toast.error(errorMessage);
      console.error("Update room error:", error);
    },
  });
};

export default useUpdateRoom;
