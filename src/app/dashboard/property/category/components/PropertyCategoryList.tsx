"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useDeleteCategory from "@/hooks/api/category/useDeleteCategory";
import useGetCategory from "@/hooks/api/category/useGetCategory";
import useUpdateCategory from "@/hooks/api/category/useUpdateCategory";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { EditPropertyCategory } from "./EditPropertyCategory";

interface Category {
  id: number;
  name: string;
}

interface PropertyCategoryPageProps {
  propertyCategoryId: number;
}

const PropertyCategoryList: FC<PropertyCategoryPageProps> = ({
  propertyCategoryId,
}) => {
  const session = useSession();
  const userId = session.data?.user.id;

  const { data, isPending, error } = useGetCategory({
    userId,
    take: 12,
  });

  const { mutateAsync: deleteCategory, isPending: pendingDelete } =
    useDeleteCategory();
  useUpdateCategory();

  const categories = (data?.data ?? []) as Category[];

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load categories. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, idx) => (
            <Skeleton key={idx} className="h-[150px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl py-8 text-center">
        <h5 className="text-lg font-medium text-gray-600">
          No categories found
        </h5>
        <p className="mt-2 text-gray-500">
          Start by creating your first category
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 py-8">
      <h5 className="text-lg font-semibold text-[#0290d1] text-center md:text-left">
        Category List
      </h5>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow hover:shadow-md transition relative"
          >
            <h6 className="text-md font-medium">{category.name}</h6>
            <div className="absolute bottom-3 right-3 flex items-center gap-3">
              <EditPropertyCategory id={category.id} />
              <Button
                variant="destructive"
                size="icon"
                disabled={pendingDelete}
                onClick={() => deleteCategory(category.id)}
              >
                {pendingDelete ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyCategoryList;
