"use client";

import { useQuery } from "@tanstack/react-query";

import useAxios from "@/app/_hooks/useAxios";
import {
  GetPropertiesByQueries,
  getPropertiesByQuery,
} from "../_api/getPropertiesByQuery";

export const useGetPropertiesByQuery = (queries: GetPropertiesByQueries) => {
  useAxios();

  return useQuery({
    queryKey: ["properties", queries],
    queryFn: () => getPropertiesByQuery(queries),
  });
};
