"use client";
import { ArrowLeft, MailCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const EmailVerificationPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.isVerified) {
      router.push("/");
    }
  }, [session, status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0290d185] to-blue-50 flex flex-col justify-center items-center py-32 px-4 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 p-8 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Check Your Email
          <MailCheck className="inline-block ml-4 w-8 h-8" />
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          We've sent a verification link to your email address. Please click the
          link in the email to verify your account and set your password.
        </p>
        <p className="mt-4 text-md text-gray-500">
          If you don't see the email, please check your spam folder.
        </p>
        <div className="mt-6">
          <Link
            href="/sign-in"
            className="text-primary hover:text-blue-600 font-medium"
          >
            <ArrowLeft className="inline-block mr-2 w-4 h-4" />
            Go to Sign In Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
