"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { getAllCategoryList } from "../_api/getAllCategory";

const useGetAllCategoryList = () => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["categorylist"],
    queryFn: () => getAllCategoryList(axiosInstance),
  });
};

export default useGetAllCategoryList;
