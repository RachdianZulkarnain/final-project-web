import Link from "next/link";

const InvalidToken = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="mx-auto w-40 h-40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-full h-full text-yellow-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3.75h.007M21.75 12a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-900">
          Oops! Verification Link Not Found
        </h2>
        <p className="text-md text-gray-600">
          We could not find a valid link. It might be expired or incorrect.
          <br />
          Please check your email and try again!
        </p>

        <div className="mt-6">
          <Link href="/sign-in">
            <span className="inline-block px-6 py-3 bg-primary text-white rounded-full hover:bg-blue-600 transition">
              Go to Login Page
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvalidToken;
