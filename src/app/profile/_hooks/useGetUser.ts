import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../_api/getUser";

const useGetUser = (userId: number) => {
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
};

export default useGetUser;
