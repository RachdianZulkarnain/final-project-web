export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <svg
        className="animate-spin"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0290d1"
        strokeWidth="3"
        strokeLinecap="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          strokeDasharray="42 150"
          strokeDashoffset="0"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="1.5s"
            values="0 150;42 150;42 150;42 150"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            dur="1.5s"
            values="0;-16;-59;-59"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <span className="text-lg font-semibold text-[#0290d1]">Loading...</span>
    </div>
  );
}
