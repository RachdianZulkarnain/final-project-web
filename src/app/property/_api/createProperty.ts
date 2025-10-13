import useAxios from "@/app/_hooks/useAxios";

export interface CreatePropertyPayload {
  description: string;
  latitude: string;
  longitude: string;
  slug: string;
  location: string;
  title: string;
  imageUrl: File[] | null;
  propertyCategoryId: number;
}

export const createProperty = async (payload: CreatePropertyPayload) => {
  const axiosInstance = useAxios();
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("slug", payload.slug);
  formData.append("description", payload.description);
  formData.append("location", payload.location);
  formData.append("latitude", payload.latitude);
  formData.append("longitude", payload.longitude);
  formData.append("propertyCategoryId", String(payload.propertyCategoryId));

  if (payload.imageUrl && payload.imageUrl.length > 0) {
    payload.imageUrl.forEach((file) => {
      formData.append("imageUrl", file);
    });
  }

  const { data } = await axiosInstance.post("/properties", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
