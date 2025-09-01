"use client";

import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type MonthlyAnalytics = {
  month: string;
  revenue: number;
};

export const useGetMonthlyAnalytics = (year: string) => {
  const session = useSession();

  return useQuery<MonthlyAnalytics[]>({
    queryKey: ["monthly-analytics", year],
    queryFn: async () => {
      const { data } = await axiosInstance.get<MonthlyAnalytics[]>(
        `/analytics/monthly?year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${session.data?.user.accessToken}`,
          },
        }
      );
      return data;
    },
    enabled: !!session.data?.user.accessToken && !!year,
  });
};
