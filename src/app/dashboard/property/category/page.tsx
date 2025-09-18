"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCreateCategory from "@/hooks/api/category/useCreateCatgory";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { parseAsInteger, useQueryState } from "nuqs";
import { FiPlus } from "react-icons/fi";
import PropertyCategoryList from "./components/PropertyCategoryList";
import { PropertyCategorySchema } from "./schemas/PropertyCategoryScema";

export default function CategoryPage() {
  const session = useSession();
  const { mutateAsync: createCategory, isPending } = useCreateCategory();

  const [propertyCategoryId] = useQueryState(
    "propertyCategoryId",
    parseAsInteger.withDefault(0)
  );

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: PropertyCategorySchema,
    onSubmit: async (values, { resetForm }) => {
      await createCategory({
        ...values,
        userId: Number(session.data?.user.id),
      });
      resetForm();
    },
  });

  return (
    <div className="flex h-screen">
      <div className="flex flex-grow flex-col bg-gray-100 dark:bg-gray-900 rounded-2xl">
        <section className="container mx-auto max-w-7xl space-y-10 p-6">
          <form onSubmit={formik.handleSubmit}>
            <div className="border-b border-gray-200 bg-gray-50 p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-[#0290d1]">
                Manage Category
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                monitor all your categories
              </p>
            </div>
            <div className="mt-6">
              <Input
                name="name"
                type="text"
                placeholder="Add category"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs text-red-500">{formik.errors.name}</p>
              )}
              <Button
                className="mt-3 w-full bg-[#0290d1] hover:bg-[#70cefa]"
                type="submit"
              >
                <FiPlus className="h-5 w-5" />
                {isPending ? "Loading..." : "Add"}
              </Button>
            </div>
          </form>

          <PropertyCategoryList propertyCategoryId={propertyCategoryId} />
        </section>
      </div>
    </div>
  );
}
