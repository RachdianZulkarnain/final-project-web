import { axiosInstance } from "@/lib/axios";
import { Property } from "@/types/property";

export const getPropertyTenant = async (id: number): Promise<Property> => {
  const { data } = await axiosInstance.get<Property>(
    `/properties/tenant/${id}`
  );
  return data;
};
