import { Toaster } from '@/components/ui/sonner';
import { useNewListingMutation } from '../api/useNewListingMutation';

export const useNewlisting = () => {

  const { mutate: mutationNewListing } = useNewListingMutation({
    onSuccess: (res: any) => {
      Toaster({
      });
    },

  });

  return {
    mutationNewListing,
  };
};
