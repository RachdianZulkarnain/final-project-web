import useAxios from "@/app/_hooks/useAxios";

export interface UpdatePeakSeasonRatePayload {
  id: number;
  price?: number;
  startDate?: Date;
  endDate?: Date;
  roomId?: number;
}

export const updatePeakSeasonRate = async (
  payload: UpdatePeakSeasonRatePayload
) => {
  const axiosInstance = useAxios();
  const { id, ...data } = payload;
  const { data: response } = await axiosInstance.patch(
    `/peak-season/${id}`,
    data
  );
  return response;
};
