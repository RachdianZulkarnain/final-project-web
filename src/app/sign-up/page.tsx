"use client";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { Hotel } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import useRegister from "./_hooks/useRegister";
import { SignupSchema } from "./schema";

const RegisterPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const { mutate: register } = useRegister();

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
      try {
        await register(values);
        toast.success("Registration successful!", { position: "top-right" });
      } catch (error) {
        toast.error("Something went wrong", { position: "top-right" });
        actions.resetForm();
      }
    },
  });

  return (
    <div className="min-h-screen bg-white flex justify-center px-4 lg:px-8 py-32 lg:py-36">
      <div className="max-w-2xl w-full space-y-10 bg-white px-10 rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl md:text-3xl font-extrabold text-[#0290d1]">
            Create Your Account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                id="firstName"
                type="text"
                placeholder="First name"
                required
                className="appearance-none rounded-md w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                {...formik.getFieldProps("firstName")}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.firstName}
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                id="lastName"
                type="text"
                placeholder="Last name"
                required
                className="appearance-none rounded-md w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                {...formik.getFieldProps("lastName")}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.lastName}
                </div>
              )}
            </div>
          </div>
          <div>
            <input
              id="email"
              type="email"
              placeholder="Email"
              required
              className="appearance-none rounded-md w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className="w-full flex justify-center py-2 px-4 text-md font-medium rounded-md text-white bg-primary hover:bg-[#0290d1] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </form>

        <div className="text-center text-md text-gray-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:text-blue-500"
          >
            Log in.
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex-1 flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm text-md font-medium text-primary bg-white hover:bg-gray-50"
          >
            Sign up with Google
          </Button>
        </div>

        <Link href="/sign-up/tenant">
          {" "}
          <div className="flex flex-col sm:flex-row gap-4">
            {" "}
            <Button className="flex-1 flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm text-md font-medium text-primary bg-white hover:cursor-pointer hover:bg-gray-50">
              {" "}
              <Hotel /> Register as Tenant{" "}
            </Button>{" "}
          </div>{" "}
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
