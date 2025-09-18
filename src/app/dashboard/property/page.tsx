"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

const actionButtons = [
  {
    href: "/dashboard/property/category",
    label: "Add Category",
    icon: <FiPlus className="h-5 w-5" />,
    variant: "default",
  },
  {
    href: "/dashboard/property/create",
    label: "Add Property",
    icon: <FiPlus className="h-5 w-5" />,
    variant: "primary",
  },
  {
    href: "/dashboard/property/room/create",
    label: "Add Rooms",
    icon: <FiPlus className="h-5 w-5" />,
    variant: "secondary",
  },
  {
    href: "/dashboard/property/room-non-availability",
    label: "Add Room Availability",
    icon: <FiPlus className="h-5 w-5" />,
    variant: "secondary",
  },
  {
    href: "/dashboard/property/peak-season-rate",
    label: "Add Peak Season Rate",
    icon: <FiPlus className="h-5 w-5" />,
    variant: "secondary",
  },
];

export default function DashboardActionPage() {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 rounded-2xl">
      <div className="flex flex-grow flex-col rounded-2xl">
        <section className="container mx-auto max-w-7xl space-y-10 p-6">
          <div className="border-b border-gray-200 bg-gray-50 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold text-[#0290d1]">
              Property Actions
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Quick links to manage your property
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {actionButtons.map((btn) => (
              <Link key={btn.href} href={btn.href} className="w-full">
                <Button
                  variant={btn.variant as any}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-[#0290d1] hover:bg-[#70cefa] hover:text-white px-4 py-3 transition-all duration-200"
                >
                  {btn.icon}
                  <span className="truncate font-medium">{btn.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
