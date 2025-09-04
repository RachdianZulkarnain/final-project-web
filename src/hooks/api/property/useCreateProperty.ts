"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreatePropertyPayload {
  description: string;
  latitude: string;
  longitude: string;
  slug: string;
  location: string;
  title: string;
  imageUrl: File[] | null;
  propertyCategoryId: number;
}

const useCreateProperty = () => {
  const router = useRouter();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePropertyPayload) => {
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
          formData.append("imageUrl", file); // field name HARUS "imageUrl"
        });
      }

      const { data } = await axiosInstance.post("/properties", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
      toast.success("✅ Create property success");
      router.push("/dashboard/property/management");
    },
    onError: (error: AxiosError<any>) => {
      console.error("❌ Create property error:", error.response?.data);
      toast.error(error.response?.data?.message || "Create property failed");
    },
  });
};

export default useCreateProperty;
