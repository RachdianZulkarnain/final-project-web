"use client";

import useAxios from "@/hooks/useAxios";
import { Tenant } from "@/types/property";
import { useQuery } from "@tanstack/react-query";

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
