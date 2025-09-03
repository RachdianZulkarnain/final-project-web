import { useDeleteListingMutation } from "../api/useDeleteListingMutation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  const { mutate: mutationDeleteListing } = useDeleteListingMutation({
    onSuccess: (res: any) => {
      toast.success("Listing deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Failed to delete listing.");
    },
  });

  return {
    mutationDeleteListing,
  };
};
