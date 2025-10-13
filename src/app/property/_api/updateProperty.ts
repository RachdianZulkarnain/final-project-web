import { axiosInstance } from "@/lib/axios";

export interface UpdatePropertyPayload {
  description: string;
  latitude: string;
  location: string;
  longitude: string;
  slug: string;
  title: string;
  imageUrl: File[] | null;
  propertyCategoryId: number;
}

export const updateProperty = async (
  id: number,
  payload: UpdatePropertyPayload
) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("slug", payload.slug);
  formData.append("description", payload.description);
  formData.append("location", payload.location);
  formData.append("latitude", payload.latitude);
  formData.append("longitude", payload.longitude);
  formData.append("propertyCategoryId", String(payload.propertyCategoryId));

  if (payload.imageUrl && payload.imageUrl.length > 0) {
    payload.imageUrl.forEach((image) => {
      formData.append("imageUrl", image);
    });
  }

  const { data } = await axiosInstance.patch(`/properties/${id}`, formData);
  return data;
};
