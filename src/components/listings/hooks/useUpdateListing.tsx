import { useUpdateListingMutation } from "../api/useUpdateListingMutation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  const { mutate: mutationUpdateListing } = useUpdateListingMutation({
    onSuccess: (res: any) => {
      toast.success(res.data.message || "Listing updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });

  return {
    mutationUpdateListing,
  };
};
