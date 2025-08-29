"use client";
import { useFormik } from "formik";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignupSchema } from "./schema";
import { toast } from "sonner";
import useRegister from "./_hooks/useRegister";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
      } catch (error) {
        toast.error("error");
        actions.resetForm();
      }
    },
  });

  return (
    <div className="min-h-screen bg-white flex justify-center px-4 lg:px-8 py-32 lg:py-36">
      <div className="max-w-2xl w-full space-y-10 bg-white px-10 rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl md:text-3xl font-extrabold text-[#0290d1]">
            Register
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="sr-only">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="First name"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                {...formik.getFieldProps("firstName")}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.firstName}
                </div>
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="sr-only">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Last name"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
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
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-white bg-primary hover:cursor-pointer hover:bg-[#0290d1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex-1 flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm text-md font-medium text-primary bg-white hover:cursor-pointer hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 48 48"
            >
              <path
                fill="#fbc02d"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#e53935"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4caf50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1565c0"
                d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Sign up with Google
          </Button>
        </div>
        <p className="text-center text-sm text-gray-500">
          By selecting continue, you agree to receive service and marketing
          auto-sent texts from Homigo, and you also agree to our{" "}
          <Link
            href="/terms"
            className="font-medium text-primary hover:text-blue-600"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-primary hover:text-blue-600"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
