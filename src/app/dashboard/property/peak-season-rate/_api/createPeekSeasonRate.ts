import useAxios from "@/app/_hooks/useAxios";

export interface PeakSeasonRatePayload {
  price: number;
  startDate: Date;
  endDate: Date;
  roomId: number;
}

export const createPeakSeasonRate = async (payload: PeakSeasonRatePayload) => {
  const axiosInstance = useAxios();
  const { data } = await axiosInstance.post("/peak-season", payload);
  return data;
};
