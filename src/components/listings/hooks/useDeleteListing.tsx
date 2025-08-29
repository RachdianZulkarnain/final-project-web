import { Toaster } from '@/components/ui/sonner';
import { useDeleteListingMutation } from '../api/useDeleteListingMutation';
import { useQueryClient } from '@tanstack/react-query';

export const useDeletelisting = () => {
  const queryClient = useQueryClient();

  const { mutate: mutationDeleteListing } = useDeleteListingMutation({
    onSuccess: (res: any) => {
      Toaster({
      });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
    onError: (err: any) => {
      console.log(err);
    },
  });

  return {
    mutationDeleteListing,
  };
};
