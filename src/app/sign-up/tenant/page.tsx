"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import { Loader2, Send, UserRoundCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useRegisterTenant from "../../../hooks/api/register-tenant/useRegisterTenant";
import { TenantSignupSchema } from "./schema";

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

const RegisterTenant = () => {
  const router = useRouter();
  const { status } = useSession();
  const { mutate: register, isPending } = useRegisterTenant();

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
    onSubmit: (values, actions) => {
      register(values, {
        onSuccess: () => actions.resetForm(),
        onError: () => actions.setSubmitting(false),
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0290d185] to-blue-50 flex justify-center px-4 lg:px-8 py-32 lg:py-36">
      <Card className="max-w-2xl w-full h-max shadow-lg border rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-4xl font-extrabold text-[#0290d1]">
            Create Tenant Account
          </CardTitle>
          <p className="mt-2 text-md text-gray-600">
            Register your account to list and manage your properties on our
            platform.
          </p>
        </CardHeader>

        <CardContent className="space-y-10 px-6 sm:px-10">
          {/* === FORM START === */}
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <OutlinedInput
                  id="firstName"
                  label="First Name"
                  type="text"
                  {...formik.getFieldProps("firstName")}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <OutlinedInput
                  id="lastName"
                  label="Last Name"
                  type="text"
                  {...formik.getFieldProps("lastName")}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.lastName}
                  </div>
                )}
              </div>
            </div>

            <OutlinedInput
              id="phone"
              label="Phone Number"
              type="text"
              {...formik.getFieldProps("phone")}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.phone}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <OutlinedInput
                  id="bankName"
                  label="Bank Name"
                  type="text"
                  {...formik.getFieldProps("bankName")}
                />
                {formik.touched.bankName && formik.errors.bankName && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.bankName}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <OutlinedInput
                  id="bankNumber"
                  label="Bank Account Number"
                  type="text"
                  {...formik.getFieldProps("bankNumber")}
                />
                {formik.touched.bankNumber && formik.errors.bankNumber && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.bankNumber}
                  </div>
                )}
              </div>
            </div>

            <OutlinedInput
              id="email"
              label="Email"
              type="email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={!formik.isValid || isPending}
                className="gap-2 w-full flex justify-center items-center py-2 px-4 text-md font-medium rounded-md text-white bg-[#0290d1] hover:bg-[#5290ad] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    Creating Tenant Account...
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </>
                ) : (
                  <>
                    Submit
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
          {/* === FORM END === */}

          {/* Or separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-500">Or</span>
            </div>
          </div>

          <Link href="/sign-up">
            <Button className="w-full flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm text-md font-medium text-white bg-[#0290d1] hover:bg-[#5290ad] gap-2">
              <UserRoundCheck /> Register as Regular User
            </Button>
          </Link>

          <div className="text-center text-md text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary hover:text-blue-500"
            >
              Sign in.
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterTenant;
