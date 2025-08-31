"use client";
import { useFormik } from "formik";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import useRegisterTenant from "./_hooks/useRegisterTenant";
import { Button } from "@/components/ui/button";
import { SignupSchema } from "../schema";

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
    },
    validationSchema: SignupSchema,
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
            Register Tenant
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* First Name */}
            <div className="flex-1">
              <input
                id="firstName"
                type="text"
                placeholder="First name"
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
                placeholder="Last name"
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

          {/* Email */}
          <div>
            <input
              id="email"
              type="email"
              placeholder="Email"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-white bg-primary hover:bg-[#0290d1] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </form>

        {/* Link to Sign In */}
        <div className="text-center text-md text-gray-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:text-blue-500"
          >
            Log in.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterTenant;
