"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ResetPasswordPage from ".";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  if (!token || token === null) router.push("/sign-in");
  return <ResetPasswordPage token={token as string} />;
};

export default ResetPassword;
