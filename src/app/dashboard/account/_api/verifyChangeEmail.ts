import { axiosInstance } from "@/lib/axios";

export interface VerifyChangeEmailPayload {
  token: string;
  password?: string;
}

export const verifyChangeEmail = async ({
  token,
  password,
}: VerifyChangeEmailPayload) => {
  const { data } = await axiosInstance.post("/account/verify-change-email", {
    token,
    password,
  });
  return data;
};
