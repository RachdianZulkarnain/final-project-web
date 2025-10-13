import { axiosInstance } from "@/lib/axios";

export interface RegisterPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  bankName: string;
  bankNumber: string;
}

export const registerTenant = async (payload: RegisterPayload) => {
  const { data } = await axiosInstance.post("/auth/register-tenant", payload);
  return data;
};
