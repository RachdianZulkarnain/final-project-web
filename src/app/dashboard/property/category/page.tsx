"use client";

import { Button } from "@/components/ui/button";
import useCreateCategory from "@/app/dashboard/property/category/_hooks/useCreateCatgory";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { parseAsInteger, useQueryState } from "nuqs";
import { FiPlus } from "react-icons/fi";
import PropertyCategoryList from "./components/PropertyCategoryList";
import { PropertyCategorySchema } from "./schemas/PropertyCategoryScema";

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

const MotionButton = motion(Button);

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
    <div className="flex flex-grow flex-col bg-gray-100 dark:bg-gray-900 rounded-2xl">
      <section className="container mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <div className="border-b border-gray-200 bg-gray-50 p-4 sm:p-6 rounded-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#0290d1]">
                Manage Category
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Monitor all your categories
              </p>
            </div>
            <MotionButton
              className="flex items-center gap-2 shadow-sm transition-shadow bg-[#0290d1] hover:bg-[#70cefa] w-full sm:w-auto text-white"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              onClick={formik.submitForm}
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
                  <span className="hidden xs:inline">Add Category</span>
                </>
              )}
            </MotionButton>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm">
          <OutlinedInput
            id="name"
            label="Add Category"
            type="text"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-xs text-red-500 mt-2">{formik.errors.name}</p>
          )}

          <div className="mt-4">
            <PropertyCategoryList propertyCategoryId={propertyCategoryId} />
          </div>
        </div>
      </section>
    </div>
  );
}
