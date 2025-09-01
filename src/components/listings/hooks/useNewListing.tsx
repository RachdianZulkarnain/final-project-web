import { useNewListingMutation } from "../api/useNewListingMutation";
import { toast } from "sonner";

export const useNewListing = () => {
  const { mutate: mutationNewListing } = useNewListingMutation({
    onSuccess: () => {
      toast.success(
        "New listing created successfully. You can now see the listing in My Listing section."
      );
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Failed to create new listing.");
    },
  });

  return {
    mutationNewListing,
  };
};
