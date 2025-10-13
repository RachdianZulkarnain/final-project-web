import { axiosInstance } from "@/lib/axios";

export interface ResendEmailVerifPayload {
  email: string;
}

export const resendEmailVerif = async (payload: ResendEmailVerifPayload) => {
  const { data } = await axiosInstance.post("/auth/reverify", payload);
  return data;
};
