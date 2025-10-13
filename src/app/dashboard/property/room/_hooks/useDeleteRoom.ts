"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteRoom } from "../_api/deleteRoom";

const useDeleteRoom = () => {
  const router = useRouter();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRoom(axiosInstance, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
      toast.success("Delete Room success");
      router.push("/dashboard/property");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data || "Delete Room failed");
    },
  });
};

export default useDeleteRoom;
