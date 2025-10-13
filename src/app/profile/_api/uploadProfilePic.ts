import useAxios from "@/app/_hooks/useAxios";

export const uploadProfilePic = async (userId: number, payload: FormData) => {
  const axiosInstance = useAxios();
  const { data } = await axiosInstance.patch(`/user/photo/${userId}`, payload, {
    headers: {
      "Content-Type": undefined, // biarkan axios otomatis set boundary multipart/form-data
    },
  });
  return data;
};
