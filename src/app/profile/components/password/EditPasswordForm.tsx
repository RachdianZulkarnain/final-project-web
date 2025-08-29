"use client";

import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import PasswordFieldInput from "./PasswordFieldInput";
import { validationSchema } from "../../schema";
import useChangePassword from "../../../change-password/_hooks/useChangePassword";

interface EditPasswordFormProps {
  onClose: () => void;
  initialOldPassword?: string;
  initialNewPassword?: string;
  initialConfirmPassword?: string;
}

export const EditPasswordForm: FC<EditPasswordFormProps> = ({
  onClose,
  initialOldPassword = "",
  initialNewPassword = "",
  initialConfirmPassword = "",
}) => {
  const router = useRouter();
  const session = useSession();
  const userId = session?.data?.user?.id;
  const { mutate: changePassword } = useChangePassword();

  useEffect(() => {
    if (session.status !== "loading" && !userId) router.push("/login");
  }, [userId]);

  const handleCancel = () => setTimeout(onClose, 500);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-gray-100 bg-opacity-100 flex items-center justify-center z-50 p-4 font-inter"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-lg shadow-xl p-6 sm:p-8 lg:p-10 max-w-2xl w-full"
      >
        <h1 className="text-xl sm:text-2xl font-medium text-gray-800 mb-6">
          Changes to your information will be reflected across your Homigo
          Account.
        </h1>

        <Formik
          initialValues={{
            oldPassword: initialOldPassword,
            newPassword: initialNewPassword,
            confirmPassword: initialConfirmPassword,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, setErrors }) => {
            // Validasi confirmPassword di frontend
            if (values.newPassword !== values.confirmPassword) {
              setErrors({
                confirmPassword: "New password and confirm password must match",
              });
              setSubmitting(false);
              return;
            }

            changePassword(
              {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
              },
              {
                onSuccess: () => {
                  setSubmitting(false);
                  setTimeout(onClose, 500);
                },
                onError: (error: any) => {
                  setSubmitting(false);
                  const msg = error?.response?.data?.message;

                  setErrors({
                    oldPassword:
                      msg === "Old password incorrect"
                        ? "Old password is incorrect"
                        : undefined,
                    newPassword:
                      msg === "Password must be different"
                        ? "New password must be different from old password"
                        : undefined,
                  });
                },
              }
            );
          }}
        >
          {() => (
            <Form>
              <PasswordFieldInput name="oldPassword" label="Current Password" />
              <PasswordFieldInput name="newPassword" label="New Password" />
              <PasswordFieldInput
                name="confirmPassword"
                label="Confirm New Password"
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-md text-primary font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-md disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </motion.section>
  );
};
