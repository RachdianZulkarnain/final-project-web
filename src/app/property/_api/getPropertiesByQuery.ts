import { axiosInstance } from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { Property } from "@/types/property";

export interface GetPropertiesByQueries extends PaginationQueries {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  guest?: number;
  title?: string;
  price?: number;
  propertycategory?: string;
}

export const getPropertiesByQuery = async (queries: GetPropertiesByQueries) => {
  const { data } = await axiosInstance.get<PageableResponse<Property>>(
    "/properties/search",
    {
      params: queries,
    }
  );
  return data;
};
