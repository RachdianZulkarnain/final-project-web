import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  GetNotificationsProps,
  getNotificationsUser,
} from "../_api/getNotificationsUser";

const useGetNotificationUser = (queries?: GetNotificationsProps) => {
  const { data: session, status: sessionStatus } = useSession();

  return useQuery({
    queryKey: ["notifications", queries],
    enabled: sessionStatus === "authenticated" && !!session,
    queryFn: () => getNotificationsUser(queries),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 30 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetNotificationUser;
