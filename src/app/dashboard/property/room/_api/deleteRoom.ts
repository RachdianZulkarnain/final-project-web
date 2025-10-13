import useAxios from "@/app/_hooks/useAxios";

export const deleteRoom = async (
  axiosInstance: ReturnType<typeof useAxios>,
  id: number
) => {
  const { data } = await axiosInstance.delete(`rooms/room/${id}`);
  return data;
};
