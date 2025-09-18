"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSetPassword from "@/hooks/api/set-password/useSetPassword";
import { useFormik } from "formik";
import { Eye, EyeClosed, Loader2, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import yupPassword from "yup-password";
import InvalidToken from "./components/InvalidToken";
import { PasswordSchema } from "./schema";

yupPassword(Yup);

interface SetPasswordPageProps {
  token: string;
}

// Reusable OutlinedInput component
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

const SetPasswordPage: FC<SetPasswordPageProps> = ({ token }) => {
  const router = useRouter();
  const { status } = useSession();
  const { mutateAsync: setPassword } = useSetPassword(token);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: PasswordSchema,
    onSubmit: async (values, actions) => {
      try {
        const { password } = values;
        if (!token) return;
        await setPassword(password);
      } catch (error) {
        console.error(error);
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  if (!token) {
    return <InvalidToken />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-[#0290d185] to-blue-50">
      <Card className="w-full max-w-xl shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-extrabold text-[#0290d1]">
            Set Your New Password
          </CardTitle>
          <p className="mt-2 text-sm sm:text-md text-gray-600">
            Enter a new password for your account.
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Password */}
            <div className="relative">
              <OutlinedInput
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                {...formik.getFieldProps("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-500 hover:cursor-pointer"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </button>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <OutlinedInput
                id="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                {...formik.getFieldProps("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-500 hover:cursor-pointer"
              >
                {showConfirmPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </button>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-md font-medium rounded-md text-white bg-[#0290d1] hover:bg-[#5290ad] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? (
                <>
                  Setting...
                  <Loader2 className="w-5 h-5 animate-spin" />
                </>
              ) : (
                <>
                  Submit
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetPasswordPage;
