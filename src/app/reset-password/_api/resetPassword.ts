import { axiosInstance } from "@/lib/axios";

export const resetPassword = async (token: string, newPassword: string) => {
  if (!token) throw new Error("Reset token is missing");

  const { data } = await axiosInstance.post(
    `/auth/reset-password?token=${token}`,
    { newPassword }
  );

  return data;
};
