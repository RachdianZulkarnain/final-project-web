import { axiosInstance } from "@/lib/axios";

export interface UpdateProfilePayload {
  name: string;
  imageFile: File | null;
}

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const updateProfileForm = new FormData();
  updateProfileForm.append("name", payload.name);

  if (payload.imageFile) {
    updateProfileForm.append("imageFile", payload.imageFile);
  }

  const { data } = await axiosInstance.patch("/account", updateProfileForm);
  return data;
};

export const logoutAfterProfileUpdate = async () => {
  await axiosInstance.post("/auth/logout");
};
