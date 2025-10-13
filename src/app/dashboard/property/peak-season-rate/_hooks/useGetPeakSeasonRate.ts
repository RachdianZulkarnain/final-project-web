"use client";

import { PageableResponse } from "@/types/pagination";
import { PeakSeasonRate } from "@/types/property";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  getPeakSeasons,
  GetPeakSeasonsQueries,
} from "../_api/getPeekSeasonRate";

export const useGetPeakSeasons = (
  queries: GetPeakSeasonsQueries,
  options?: UseQueryOptions<PageableResponse<PeakSeasonRate>, Error>
) => {
  return useQuery<PageableResponse<PeakSeasonRate>, Error>({
    queryKey: ["peakSeasonRate", queries],
    queryFn: () => getPeakSeasons(queries),
    staleTime: 1000 * 60 * 5,
    enabled: !!queries.userId,
    ...options,
  });
};
