import { Toaster } from '@/components/ui/sonner';
import { useUpdateListingMutation } from '../api/useUpdateListingMutation';
import { useQueryClient } from '@tanstack/react-query';

export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  // const { toast } = useToast();
  const { mutate: mutationUpdateListing } = useUpdateListingMutation({
    onSuccess: (res: any) => {
      Toaster({

      });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
    onError: (err: any) => {
      console.log(err);
      Toaster({

      });
    },
  });
  return {
    mutationUpdateListing,
  };
};
