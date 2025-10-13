import { AxiosInstance } from "axios";

export const deleteCategory = async (
  axiosInstance: AxiosInstance,
  id: number
) => {
  const { data } = await axiosInstance.delete(`/categories/${id}`);
  return data;
};
