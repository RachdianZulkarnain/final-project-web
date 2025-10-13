import useAxios from "@/app/_hooks/useAxios";
import { Notification } from "@/types/notification";
import { PaginationQueries } from "@/types/pagination";

export interface GetNotificationsProps extends PaginationQueries {
  isRead?: boolean;
  role?: string;
  limit?: number;
}

export const getNotificationsUser = async (queries?: GetNotificationsProps) => {
  const axiosInstance = useAxios();
  const { data } = await axiosInstance.get<Notification[]>(
    "/notifications/user",
    {
      params: {
        ...queries,
        _: Date.now(),
      },
    }
  );
  return data;
};
