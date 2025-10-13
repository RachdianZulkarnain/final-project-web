import useAxios from "@/app/_hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { RoomNonAvailability } from "@/types/property";

export interface GetRoomNonAvailabilitiesListQueries extends PaginationQueries {
  search?: string;
  userId?: number;
}

export const getRoomNonAvailabilities = async (
  queries: GetRoomNonAvailabilitiesListQueries
): Promise<PageableResponse<RoomNonAvailability>> => {
  const axiosInstance = useAxios();
  const { data } = await axiosInstance.get<
    PageableResponse<RoomNonAvailability>
  >("/room-non-availabilities", { params: queries });
  return data;
};
