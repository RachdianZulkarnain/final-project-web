import useAxios from "@/app/_hooks/useAxios";

export interface Facility {
  id?: number;
  title: string;
  description: string;
  isDeleted?: boolean;
}

export interface UpdateRoomPayload {
  type: "Deluxe" | "Standard" | "Suite";
  name: string;
  stock: number;
  price: number;
  guest: number;
  propertyId: number;
  imageUrl?: File;
  facilities: Facility[];
}

export const updateRoom = async (
  axiosInstance: ReturnType<typeof useAxios>,
  id: number,
  payload: UpdateRoomPayload
) => {
  const formData = new FormData();

  formData.append("type", payload.type);
  formData.append("name", payload.name);
  formData.append("stock", String(payload.stock));
  formData.append("price", String(payload.price));
  formData.append("guest", String(payload.guest));
  formData.append("propertyId", String(payload.propertyId));

  if (payload.imageUrl) {
    formData.append("imageUrl", payload.imageUrl);
  }

  formData.append("facilities", JSON.stringify(payload.facilities));

  const { data } = await axiosInstance.patch(`/rooms/room/${id}`, formData);
  return data;
};
