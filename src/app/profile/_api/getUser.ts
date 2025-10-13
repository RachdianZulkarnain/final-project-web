import useAxios from "@/app/_hooks/useAxios";
import { User } from "@/types/user";

export const getUser = async (userId: number): Promise<User> => {
  const axiosInstance = useAxios();
  const { data } = await axiosInstance.get(`/user/${userId}`);
  return data;
};
