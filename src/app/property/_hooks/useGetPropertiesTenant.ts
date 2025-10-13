"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  getPropertiesTenant,
  GetPropertyQueries,
} from "../_api/getPropertiesTenant";

export const useGetPropertiesTenant = (queries: GetPropertyQueries) => {
  useAxios();

  return useQuery({
    queryKey: ["tenant-properties", queries],
    queryFn: () => getPropertiesTenant(queries),
  });
};
