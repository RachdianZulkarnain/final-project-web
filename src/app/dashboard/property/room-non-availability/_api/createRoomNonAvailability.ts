import { axiosInstance } from "@/lib/axios";

export interface CreateRoomNonAvailabilityPayload {
  reason: string;
  startDate: Date;
  endDate: Date;
  roomId: number;
}

export const createRoomNonAvailability = async (
  payload: CreateRoomNonAvailabilityPayload
) => {
  const payloadToSend = {
    ...payload,
    startDate: payload.startDate.toISOString(),
    endDate: payload.endDate.toISOString(),
  };

  const { data } = await axiosInstance.post(
    "/room-non-availabilities",
    payloadToSend
  );
  return data;
};
