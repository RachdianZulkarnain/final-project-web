import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDeleteListingMutation } from "../api/useDeleteListingMutation";

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
