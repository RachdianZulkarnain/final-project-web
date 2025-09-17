"use client";

import useAxios from "@/hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { Property } from "@/types/property";
import { useQuery } from "@tanstack/react-query";

export interface GetPropertiesByQueries extends PaginationQueries {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  guest?: number;
  title?: string;
  price?: number;
  propertycategory?: string;
}

export const useGetPropertiesByQuery = (queries: GetPropertiesByQueries) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["properties", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Property>>(
        "/properties/search",
        {
          params: queries,
        }
      );
      return data;
    },
  });
};
