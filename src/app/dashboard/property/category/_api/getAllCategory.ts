import { PageableResponse } from "@/types/pagination";
import { PropertyCategory } from "@/types/propertyCategory";
import { AxiosInstance } from "axios";

export const getAllCategoryList = async (
  axiosInstance: AxiosInstance
): Promise<PageableResponse<PropertyCategory>> => {
  const { data } =
    await axiosInstance.get<PageableResponse<PropertyCategory>>(
      "/categories/list"
    );
  return data;
};
