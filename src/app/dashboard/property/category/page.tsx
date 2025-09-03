"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCreateCategory from "@/hooks/api/category/useCreateCatgory";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import PropertyCategoryList from "./components/PropertyCategoryList";
import { PropertyCategorySchema } from "./schemas/PropertyCategoryScema";

interface CreatePropertyPageProps {
  propertyCategoryId: number;
}

const CategoryPage = ({ propertyCategoryId }: CreatePropertyPageProps) => {
  const session = useSession();
  const { mutateAsync: createCategory, isPending } = useCreateCategory();

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: PropertyCategorySchema,
    onSubmit: async (values, { resetForm }) => {
      await createCategory({
        ...values,
        userId: Number(session.data?.user.id), // ✅ kirim userId ke backend
      });
      resetForm();
    },
  });

  return (
    <div className="flex h-screen">
      <div className="flex flex-grow flex-col bg-gray-100 dark:bg-gray-900">
        <section className="container mx-auto max-w-7xl space-y-10 p-6">
          <div>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <h5 className="mb-3 text-center font-semibold md:text-left">
                  Add Category
                </h5>
                <Input
                  name="name"
                  type="text"
                  placeholder="Add category"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {!!formik.touched.name && !!formik.errors.name ? (
                  <p className="text-xs text-red-500">{formik.errors.name}</p>
                ) : null}
                <Button className="mt-3 w-full" type="submit">
                  {isPending ? "Loading..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
          <div>
            <PropertyCategoryList propertyCategoryId={propertyCategoryId} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoryPage;
