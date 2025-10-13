import { axiosInstance } from "@/lib/axios";

export const setPassword = async (password: string, token: string) => {
  const { data } = await axiosInstance.post(
    "/auth/verify-email-and-set-password",
    { password },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
