"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { getProperty } from "../_api/getProperty";

const useGetProperty = (slug: string) => {
  useAxios();

  return useQuery({
    queryKey: ["property", slug],
    queryFn: () => getProperty(slug),
    enabled: !!slug,
  });
};

export default useGetProperty;
