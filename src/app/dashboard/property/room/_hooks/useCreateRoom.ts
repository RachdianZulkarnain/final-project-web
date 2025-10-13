"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createRoom, CreateRoomPayload } from "../_api/createRoom";

const useCreateRoom = () => {
  const router = useRouter();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoomPayload) =>
      createRoom(axiosInstance, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
      toast.success("Create room success");
      router.push("/dashboard/property");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Create room failed");
    },
  });
};

export default useCreateRoom;
