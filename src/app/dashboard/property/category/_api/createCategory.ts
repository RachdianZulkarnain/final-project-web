import { AxiosInstance } from "axios";

export interface CreateCategoryPayload {
  name: string;
  userId: number;
}

export const createCategory = async (
  axiosInstance: AxiosInstance,
  payload: CreateCategoryPayload
) => {
  console.log("📦 Payload ke backend:", payload);
  const { data } = await axiosInstance.post("/categories", payload);
  return data;
};
