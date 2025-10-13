"use client";

import { useQuery } from "@tanstack/react-query";
import { getTenant } from "../_api/getTenant";

export const useGetTenant = () => {
  return useQuery({
    queryKey: ["tenant"],
    queryFn: () => getTenant(),
  });
};
