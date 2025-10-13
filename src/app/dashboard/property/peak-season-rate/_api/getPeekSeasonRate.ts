import useAxios from "@/app/_hooks/useAxios";
import { PageableResponse } from "@/types/pagination";
import { PeakSeasonRate } from "@/types/property";

export interface GetPeakSeasonsQueries {
  page?: number;
  limit?: number;
  search?: string;
  price?: number;
  startDate?: Date;
  endDate?: Date;
  roomId?: number;
  userId?: number;
}

export const getPeakSeasons = async (
  queries: GetPeakSeasonsQueries
): Promise<PageableResponse<PeakSeasonRate>> => {
  const axiosInstance = useAxios();
  const { data } = await axiosInstance.get<PageableResponse<PeakSeasonRate>>(
    "/peak-season",
    { params: queries }
  );
  return data;
};
