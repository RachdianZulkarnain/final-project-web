import { axiosInstance } from "@/lib/axios";

export interface ForgotPasswordPayload {
  email: string;
}

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const { data } = await axiosInstance.post("/auth/forgot-password", payload);
  return data;
};
