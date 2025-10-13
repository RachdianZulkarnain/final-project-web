import useAxios from "@/app/_hooks/useAxios";

export const deleteProperty = async (id: number) => {
  const axiosInstance = useAxios();
  const { data } = await axiosInstance.delete(`/properties/${id}`);
  return data;
};
