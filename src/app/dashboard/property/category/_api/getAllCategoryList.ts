import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { PropertyCategory } from "@/types/propertyCategory";
import { AxiosInstance } from "axios";

export interface GetCategoryListQueries extends PaginationQueries {
  search?: string;
  userId?: number;
}

export const getCategoryList = async (
  axiosInstance: AxiosInstance,
  queries: GetCategoryListQueries
): Promise<PageableResponse<PropertyCategory>> => {
  const { data } = await axiosInstance.get<PageableResponse<PropertyCategory>>(
    "/categories/",
    { params: queries }
  );
  return data;
};
