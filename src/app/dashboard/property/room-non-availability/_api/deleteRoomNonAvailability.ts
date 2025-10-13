import useAxios from "@/app/_hooks/useAxios";

export const deleteRoomNonAvailability = async (id: number) => {
  const axiosInstance = useAxios();
  const { data } = await axiosInstance.delete(
    `/room-non-availabilities/room/${id}`
  );
  return data;
};
