import { axiosInstance } from "@/lib/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  const { data } = await axiosInstance.post("/auth/login", payload);
  return data;
};
