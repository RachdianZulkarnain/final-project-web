import { axiosInstance } from "@/lib/axios";
import { Tenant } from "@/types/property";

export const getTenant = async (): Promise<Tenant> => {
  const { data } = await axiosInstance.get<Tenant>("/account/tenant");
  return data;
};
