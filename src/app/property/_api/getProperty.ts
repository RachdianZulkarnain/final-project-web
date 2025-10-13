import { axiosInstance } from "@/lib/axios";
import { Property } from "@/types/property";

export const getProperty = async (slug: string): Promise<Property> => {
  const { data } = await axiosInstance.get<Property>(`/properties/${slug}`);
  return data;
};
