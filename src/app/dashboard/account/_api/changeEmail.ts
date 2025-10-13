import { axiosInstance } from "@/lib/axios";

export interface ChangeEmailPayload {
  email: string;
}

export const changeEmail = async (payload: ChangeEmailPayload) => {
  const { data } = await axiosInstance.post("/account/change-email", payload);
  return data;
};
