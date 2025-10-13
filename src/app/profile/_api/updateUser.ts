import useAxios from "@/app/_hooks/useAxios";
import { User } from "@/types/user";

export type UpdateUserPayload = Partial<
  Pick<User, "firstName" | "lastName" | "email">
>;

export const updateUser = async (
  userId: number,
  payload: UpdateUserPayload
) => {
  const axiosInstance = useAxios();
  const { data } = await axiosInstance.patch(`/user/${userId}`, payload);
  return data;
};
