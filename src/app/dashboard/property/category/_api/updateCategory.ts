import { AxiosInstance } from "axios";

export interface UpdateCategoryPayload {
  id: number;
  name: string;
}

export const updateCategory = async (
  axiosInstance: AxiosInstance,
  payload: UpdateCategoryPayload
) => {
  const { data } = await axiosInstance.put(`/categories/${payload.id}`, {
    name: payload.name,
  });
  return data;
};
