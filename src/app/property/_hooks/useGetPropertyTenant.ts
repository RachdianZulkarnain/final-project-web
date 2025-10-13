"use client";

import useAxios from "@/app/_hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { getPropertyTenant } from "../_api/getPropertyTenant";

const useGetPropertyTenant = (id: number) => {
  useAxios();

  return useQuery({
    queryKey: ["property", id],
    queryFn: () => getPropertyTenant(id),
    enabled: !!id,
  });
};

export default useGetPropertyTenant;
