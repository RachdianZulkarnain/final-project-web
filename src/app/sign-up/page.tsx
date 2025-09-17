"use client";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { ArrowRight, Hotel } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import useRegister from "../../hooks/api/sign-up/useRegister";
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0290d1]">
            Create Your Account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                id="firstName"
                type="text"
                placeholder="Enter Your First Name"
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
                placeholder="Enter Your Last Name"
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
              placeholder="Enter Your Email"
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
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-md font-medium rounded-md text-white bg-[#0290d1] hover:bg-[#5290ad] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex-1 flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm text-md font-medium text-primary bg-white hover:bg-gray-50"
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

export default RegisterPage;
