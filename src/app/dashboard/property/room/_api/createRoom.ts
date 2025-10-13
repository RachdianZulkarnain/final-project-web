import useAxios from "@/app/_hooks/useAxios";

export interface Facility {
  title: string;
  description: string;
}

export interface CreateRoomPayload {
  type: "Deluxe" | "Standard" | "Suite";
  name: string;
  stock: number;
  price: number;
  guest: number;
  propertyId: number;
  imageUrl: File | null;
  facilities: Facility[];
}

export const createRoom = async (
  axiosInstance: ReturnType<typeof useAxios>,
  payload: CreateRoomPayload
) => {
  const formData = new FormData();
  formData.append("type", payload.type);
  formData.append("name", payload.name);
  formData.append("stock", String(payload.stock));
  formData.append("price", String(payload.price));
  formData.append("guest", String(payload.guest));
  formData.append("propertyId", String(payload.propertyId));

  if (payload.imageUrl) {
    formData.append("image", payload.imageUrl);
  }

  formData.append("facilities", JSON.stringify(payload.facilities));

  const { data } = await axiosInstance.post("/rooms", formData);
  return data;
};
