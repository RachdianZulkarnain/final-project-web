"use client";

import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { parseAsInteger, useQueryState } from "nuqs";
import { FiPlus } from "react-icons/fi";
import PropertyCategoryList from "./components/PropertyCategoryList";
import useCreateCategory from "@/hooks/api/category/useCreateCatgory";
import { PropertyCategorySchema } from "./schemas/PropertyCategoryScema";
import { Loader2 } from "lucide-react";

const OutlinedInput = ({
  label,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        placeholder=" "
        className="peer block w-full rounded-md border border-gray-300 px-3 pt-5 pb-2 text-sm text-gray-900 focus:border-[#0290d1] focus:ring-1 focus:ring-[#0290d1]"
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-2 -top-2 bg-gray-50 px-1 text-sm text-gray-500
        peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
        peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[#0290d1] transition-all"
      >
        {label}
      </label>
    </div>
  );
};

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
                Monitor all your categories
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <OutlinedInput
                id="name"
                label="Add Category"
                type="text"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs text-red-500">{formik.errors.name}</p>
              )}
              <Button
                className="mt-3 w-full bg-[#0290d1] hover:bg-[#70cefa] flex items-center justify-center gap-2"
                type="submit"
                disabled={isPending || !formik.isValid}
              >
                {isPending ? (
                  <>
                    Loading...
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </>
                ) : (
                  <>
                    <FiPlus className="h-5 w-5" />
                    Add
                  </>
                )}
              </Button>
            </div>
          </form>

          <PropertyCategoryList propertyCategoryId={propertyCategoryId} />
        </section>
      </div>
    </div>
  );
}
