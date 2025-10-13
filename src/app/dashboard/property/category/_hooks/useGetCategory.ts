"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  getCategoryList,
  GetCategoryListQueries,
} from "../_api/getAllCategoryList";

const useGetCategoryList = (queries: GetCategoryListQueries) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["categorylist", queries],
    queryFn: () => getCategoryList(axiosInstance, queries),
  });
};

export default useGetCategoryList;
