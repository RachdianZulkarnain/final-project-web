import { axiosInstance } from "@/lib/axios";

export interface UpdateTenantPayload {
  name?: string;
  phone?: string;
  bankName?: string;
  bankNumber?: string;
  imageFile?: File | null;
}

export const updateTenant = async (payload: UpdateTenantPayload) => {
  const updateTenantForm = new FormData();

  if (payload.name) updateTenantForm.append("name", payload.name);
  if (payload.phone) updateTenantForm.append("phone", payload.phone);
  if (payload.bankName) updateTenantForm.append("bankName", payload.bankName);
  if (payload.bankNumber)
    updateTenantForm.append("bankNumber", payload.bankNumber);
  if (payload.imageFile)
    updateTenantForm.append("imageFile", payload.imageFile);

  const { data } = await axiosInstance.patch(
    "/account/tenant",
    updateTenantForm
  );
  return data;
};
