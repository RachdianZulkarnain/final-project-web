"use client";

import { useQuery } from "@tanstack/react-query";
import { Tenant } from "@/types/property";
import useAxios from "@/hooks/useAxios";

const useGetTenant = () => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["tenant"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Tenant>(`/account/tenant`);
      return data;
    },
  });
};

export default useGetTenant;
