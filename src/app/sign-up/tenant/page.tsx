"use client";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { UserRoundCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useRegisterTenant from "../../../hooks/api/register-tenant/useRegisterTenant";
import { TenantSignupSchema } from "./schema";

const RegisterTenant = () => {
  const router = useRouter();
  const { status } = useSession();
  const { mutate: register } = useRegisterTenant();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bankName: "",
      bankNumber: "",
    },
    validationSchema: TenantSignupSchema,
    onSubmit: async (values, actions) => {
      register(values, {
        onSuccess: () => actions.resetForm(),
        onError: () => actions.setSubmitting(false),
      });
    },
  });

  return (
    <div className="min-h-screen bg-white flex justify-center px-4 lg:px-8 py-32 lg:py-36">
      <div className="max-w-2xl w-full space-y-10 bg-white px-10 rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl md:text-3xl font-extrabold text-[#0290d1]">
            Create Tenant Account
          </h2>
          <p className="mt-2 text-md text-gray-600">
            Register your account to list and manage your properties on our
            platform.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* First Name */}
            <div className="flex-1">
              <input
                id="firstName"
                type="text"
                placeholder="Enter Your First Name"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                {...formik.getFieldProps("firstName")}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.firstName}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div className="flex-1">
              <input
                id="lastName"
                type="text"
                placeholder="Enter Your Last Name"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                {...formik.getFieldProps("lastName")}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.lastName}
                </div>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <input
              id="phone"
              type="text"
              placeholder="Enter Your Phone Number"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              {...formik.getFieldProps("phone")}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.phone}
              </div>
            )}
          </div>

          {/* Bank Name */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                id="bankName"
                type="text"
                placeholder="Enter Your Bank Name"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                {...formik.getFieldProps("bankName")}
              />
              {formik.touched.bankName && formik.errors.bankName && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.bankName}
                </div>
              )}
            </div>

            {/* Bank Number */}
            <div className="flex-1">
              <input
                id="bankNumber"
                type="text"
                placeholder="Enter Your Bank account Number"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                {...formik.getFieldProps("bankNumber")}
              />
              {formik.touched.bankNumber && formik.errors.bankNumber && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.bankNumber}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              id="email"
              type="email"
              placeholder="Enter Your Email"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-white bg-[#0290d1] hover:bg-[#5290ad] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gradient-to-br from-white to-blue-50 px-3 text-gray-500">
              Or
            </span>
          </div>
        </div>

        <Link href="/sign-up">
          {" "}
          <div className="flex flex-col sm:flex-row gap-4">
            {" "}
            <Button className="flex-1 flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm text-md font-medium text-primary bg-white hover:cursor-pointer hover:bg-gray-50">
              {" "}
              <UserRoundCheck /> Register as Regular User{" "}
            </Button>{" "}
          </div>{" "}
        </Link>

        {/* Link to Sign In */}
        <div className="text-center text-md text-gray-600 mt-10">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:text-blue-500"
          >
            Sign in.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterTenant;
