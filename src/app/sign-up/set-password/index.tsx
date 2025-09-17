"use client";
import useSetPassword from "@/hooks/api/set-password/useSetPassword";
import { useFormik } from "formik";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-white to-blue-50">
      <div className="p-10 max-w-xl w-full mx-auto space-y-8">
        <div className="text-start">
          <h2 className="text-4xl font-extrabold text-[#0290d1]">
            Set Your New Password
          </h2>
          <p className="mt-2 text-md text-gray-600">
            Enter a new password for your account.
          </p>
        </div>
        <form className="mt-8 space-y-8" onSubmit={formik.handleSubmit}>
          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm pr-12"
              placeholder="Password"
              {...formik.getFieldProps("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            {formik.touched.password && formik.errors.password && (
              <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm New Password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm pr-12"
              {...formik.getFieldProps("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="absolute top-full left-0 text-red-500 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
              className="gap-2 group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-[#0290d1] hover:cursor-pointer hover:bg-[#4992b4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? (
                <>
                  Set Password...
                  <Loader2 className="w-6 h-6 animate-spin" />
                </>
              ) : (
                <>Submit</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordPage;
