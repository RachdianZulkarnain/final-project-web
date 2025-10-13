"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getRoomCalendar } from "../_api/getRoomCalendar";

const useRoomCalendar = (
  roomId: number,
  date: Date = new Date(),
  options = { enabled: true }
) => {
  useAxios();

  return useQuery({
    queryKey: ["roomCalendar", roomId, format(date, "yyyy-MM")],
    queryFn: () => getRoomCalendar(roomId, date),
    staleTime: 1000 * 60 * 5, // cache 5 menit
    enabled: roomId > 0 && options.enabled,
  });
};

export default useRoomCalendar;
