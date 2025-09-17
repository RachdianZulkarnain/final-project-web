"use client";

import { useSearchParams } from "next/navigation";
import ReverifyPage from "../../components/reverify/page";

export default function Reverify() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // jika token tidak ada, redirect ke homepage
  if (!token) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  return <ReverifyPage token={token} />;
}
