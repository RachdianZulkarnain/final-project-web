// src/hooks/useGetAnalytics.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios";

type AnalyticsResponse = {
  totalRevenue: number;
  totalEvents: number;
  totalTickets: number;
  totalVouchers: number;
};

export const useGetAnalytics = () => {
  const session = useSession();

  return useQuery<AnalyticsResponse>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<AnalyticsResponse>(
        "/analytics",
        {
          headers: {
            Authorization: `Bearer ${session.data?.user.accessToken}`,
          },
        }
      );
      return data;
    },
    enabled: !!session.data?.user.accessToken,
  });
};
