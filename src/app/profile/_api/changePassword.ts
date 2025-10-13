import useAxios from "@/app/_hooks/useAxios";

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const changePassword = async (payload: ChangePasswordPayload) => {
  const axiosInstance = useAxios();
  const { data } = await axiosInstance.patch("/auth/change-password", payload);
  return data;
};
