import { axiosInstance } from "@/lib/axios";

export const verifyEmail = async (token: string) => {
  if (!token) throw new Error("Verification token is missing");

  const { data } = await axiosInstance.post(
    "/auth/verify-email",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};
