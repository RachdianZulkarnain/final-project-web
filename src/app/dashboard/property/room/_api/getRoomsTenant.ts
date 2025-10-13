import useAxios from "@/app/_hooks/useAxios";
import { PageableResponse } from "@/types/pagination";
import { Room } from "@/types/property";

export interface GetRoomsQueries {
  page?: number;
  size?: number;
  propertyId?: number;
  search?: string;
}

export const getRoomsTenant = async (
  axiosInstance: ReturnType<typeof useAxios>,
  queries: GetRoomsQueries
): Promise<PageableResponse<Room>> => {
  const { data } = await axiosInstance.get<PageableResponse<Room>>(
    "/rooms/tenant",
    {
      params: queries,
    }
  );
  return data;
};
