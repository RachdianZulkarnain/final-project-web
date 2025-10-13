import { axiosInstance } from "@/lib/axios";
import { Property } from "@/types/property";
import { PageableResponse, PaginationQueries } from "@/types/pagination";

export interface GetPropertiesQuery extends PaginationQueries {
  location?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  search?: string;
  guest?: number;
}

export const getProperties = async (queries: GetPropertiesQuery) => {
  const { data } = await axiosInstance.get<PageableResponse<Property>>(
    "/properties",
    {
      params: queries,
    }
  );
  return data;
};
