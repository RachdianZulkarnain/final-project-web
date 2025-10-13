import { axiosInstance } from "@/lib/axios";

export interface RegisterPayload {
  email: string;
  firstName: string;
  lastName: string;
}

export const register = async (payload: RegisterPayload) => {
  const { data } = await axiosInstance.post("/auth/register", payload);
  return data;
};
