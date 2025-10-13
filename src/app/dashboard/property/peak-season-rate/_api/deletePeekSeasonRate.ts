import useAxios from "@/app/_hooks/useAxios";

export const deletePeakSeasonRate = async (id: number) => {
  const axiosInstance = useAxios();
  const { data } = await axiosInstance.delete(`/peak-season/${id}`);
  return data;
};
