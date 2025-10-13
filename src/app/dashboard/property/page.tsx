"use client";

import { Button } from "@/components/ui/button";
import useCreateCategory from "@/app/dashboard/property/category/_hooks/useCreateCatgory";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import { FiPlus } from "react-icons/fi";

import PropertyCategoryList from "./category/components/PropertyCategoryList";
import { PropertyCategorySchema } from "./category/schemas/PropertyCategoryScema";
import PropertyTenantList from "./management/components/PropertyTenantList";
import RoomTenantList from "./room/components/RoomTenantList";

const OutlinedInput = ({
  label,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
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

const MotionButton = motion(Button);

export default function DashboardManagementPage() {
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
    <div className="flex flex-col space-y-10 p-4 sm:p-6 bg-gradient-to-br from-[#0290d11a] to-blue-50 min-h-screen rounded-2xl">
      <section className="container mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <div className="border-b border-gray-200 bg-gray-50 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#0290d1]">
              Manage Category
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Monitor all your categories
            </p>
          </div>
          <MotionButton
            className="flex items-center gap-2 transition-shadow border border-[#0290D1] shadow-[2px_2px_0_0_rgba(2,144,209,1)] bg-white hover:bg-[rgba(112,206,250,1)] w-full sm:w-auto text-black hover:text-white"
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
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm space-y-3">
          <OutlinedInput
            id="name"
            label="Add Category"
            type="text"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-xs text-red-500 mt-2">{formik.errors.name}</p>
          )}
          <PropertyCategoryList propertyCategoryId={propertyCategoryId} />
        </div>
      </section>

      <section className="container mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <div className="border-b border-gray-200 bg-gray-50 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#0290d1]">
              Manage Properties
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Monitor all your properties
            </p>
          </div>
          <Link
            href="/dashboard/property/create"
            className="self-start sm:self-auto w-full sm:w-auto"
          >
            <MotionButton
              className="flex items-center gap-2 transition-shadow border border-[#0290D1] shadow-[2px_2px_0_0_rgba(2,144,209,1)] bg-white hover:bg-[rgba(112,206,250,1)] w-full sm:w-auto text-black hover:text-white"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus className="h-5 w-5" />
              <span className="hidden xs:inline">Add Property</span>
            </MotionButton>
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm">
          <PropertyTenantList />
        </div>
      </section>

      <section className="container mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <div className="border-b border-gray-200 bg-gray-50 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#0290d1]">
              Manage Room
            </h2>
            <p className="mt-1 text-sm text-gray-600">Monitor all your rooms</p>
          </div>
          <Link
            href="/dashboard/property/room/create"
            className="w-full sm:w-auto"
          >
            <MotionButton
              className="flex items-center gap-2 transition-shadow border border-[#0290D1] shadow-[2px_2px_0_0_rgba(2,144,209,1)] bg-white hover:bg-[rgba(112,206,250,1)] w-full sm:w-auto text-black hover:text-white"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus className="h-5 w-5" />
            </MotionButton>
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm">
          <RoomTenantList />
        </div>
      </section>
    </div>
  );
}
