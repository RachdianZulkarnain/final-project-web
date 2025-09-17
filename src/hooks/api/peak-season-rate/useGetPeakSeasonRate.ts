"use client";

import useAxios from "@/hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { PeakSeasonRate } from "@/types/property";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface GetPeakSeasonsQueries extends PaginationQueries {
  search?: string;
  price?: number;
  startDate?: Date;
  endDate?: Date;
  roomId?: number;
  userId?: number;
}

export const useGetPeakSeasons = (
  queries: GetPeakSeasonsQueries,
  options?: UseQueryOptions<PageableResponse<PeakSeasonRate>, Error>
) => {
  const axiosInstance = useAxios();

  return useQuery<PageableResponse<PeakSeasonRate>, Error>({
    queryKey: ["peakSeasonRate", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PageableResponse<PeakSeasonRate>
      >("/peak-season", { params: queries });
      return data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!queries.userId,
    ...options,
  });
};
