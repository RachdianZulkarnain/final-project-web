import { axiosInstance } from "@/lib/axios";

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const changePassword = async (payload: ChangePasswordPayload) => {
  if (payload.newPassword !== payload.confirmPassword) {
    throw new Error("New password and confirm password do not match");
  }

  const { confirmPassword, ...dataToSend } = payload;

  const { data } = await axiosInstance.patch(
    "/account/change-password",
    dataToSend
  );
  return data;
};
