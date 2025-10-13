import { axiosInstance } from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { Property } from "@/types/property";

export interface GetPropertyQueries extends PaginationQueries {
  userId?: number;
  search?: string;
}

export const getPropertiesTenant = async (queries: GetPropertyQueries) => {
  const { data } = await axiosInstance.get<PageableResponse<Property>>(
    "/properties/tenant",
    { params: queries }
  );
  return data;
};
