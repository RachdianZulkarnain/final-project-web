"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormik } from "formik";
import { Loader2, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import * as Yup from "yup";
import useForgotPassword from "./_hooks/useForgotPassword";

// Reusable OutlinedInput (floating label)
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
        className="absolute left-2 -top-2 bg-white px-1 text-sm text-gray-500
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[#0290d1] transition-all"
      >
        {label}
      </label>
    </div>
  );
};

const ForgotPasswordPage = () => {
  const router = useRouter();
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/user/profile");
    }
  }, [status, router]);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values) => {
      forgotPassword(values);
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0290d185] to-blue-50 flex items-center justify-center py-16 lg:py-24 px-4">
      <Card className="w-full max-w-xl shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-[#0290d1]">
            Forgot your password?
          </CardTitle>
          <p className="text-gray-600 mt-2 text-md leading-relaxed">
            Enter the email linked to your account, and we will send a reset
            link to help you regain access.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <OutlinedInput
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty || isPending}
              className="gap-2 group relative w-full flex justify-center items-center py-3 px-4 text-lg font-semibold rounded-md text-white bg-[#0290d1] hover:bg-[#5290ad] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isPending ? (
                <>
                  Processing...
                  <Loader2 className="w-6 h-6 animate-spin" />
                </>
              ) : (
                <>
                  Submit
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#0290d1]">Or</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 items-center">
          <Link href="/sign-up" className="text-[#0290d1] hover:underline">
            Create an account
          </Link>
          <Link href="/sign-in" className="text-[#0290d1] hover:underline">
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
};

export default ForgotPasswordPage;
