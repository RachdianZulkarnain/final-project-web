"use client";

import { useSearchParams } from "next/navigation";
import SetPasswordPage from ".";

const SetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  return <SetPasswordPage token={token as string} />;
};

export default SetPassword;
