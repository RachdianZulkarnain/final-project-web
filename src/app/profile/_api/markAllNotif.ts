import useAxios from "@/app/_hooks/useAxios";

export const markAllNotif = async () => {
  const axiosInstance = useAxios();
  const { data } = await axiosInstance.post("/notifications/read-all");
  return data;
};
