"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { GetRoomsQueries, getRoomsTenant } from "../_api/getRoomsTenant";

export const useGetRoomsTenant = (queries: GetRoomsQueries) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["room", queries],
    queryFn: () => getRoomsTenant(axiosInstance, queries),
  });
};
