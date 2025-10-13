import useAxios from "@/app/_hooks/useAxios";

export interface UpdateRoomNonAvailabilityPayload {
  id: number;
  reason: string;
}

export const updateRoomNonAvailability = async (
  payload: UpdateRoomNonAvailabilityPayload
) => {
  const axiosInstance = useAxios();
  const { data } = await axiosInstance.patch(
    `/room-non-availabilities/room/${payload.id}`,
    payload
  );
  return data;
};
