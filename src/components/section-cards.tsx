"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useGetAnalytics } from "@/app/dashboard/_hooks/useGetAnalytics";

export function SectionCards() {
  const [showRevenue, setShowRevenue] = useState(false);
  const { data, isLoading } = useGetAnalytics();

  if (isLoading) return <p>Loading analytics...</p>;
  if (!data) return <p>No data</p>;

  return (
    <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue */}
      <Card className="border-4 border-gray-900 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="flex flex-col gap-2">
          <CardDescription className="text-sm font-bold uppercase text-gray-600">
            Total Revenue
          </CardDescription>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-black tracking-wide text-gray-900">
              {showRevenue
                ? `Rp ${data.totalRevenue.toLocaleString()}`
                : "**** **** ****"}
            </CardTitle>
            <button
              onClick={() => setShowRevenue((prev) => !prev)}
              className="text-gray-600 transition-colors hover:text-blue-600"
            >
              {showRevenue ? (
                <EyeOff className="h-5 ml-2 w-5" />
              ) : (
                <Eye className="h-5 ml-2 w-5" />
              )}
            </button>
          </div>
        </CardHeader>
      </Card>

      {/* Total Events */}
      <Card className="border-4 border-gray-900 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardDescription className="text-sm font-bold uppercase text-gray-600">
            Total Events
          </CardDescription>
          <CardTitle className="text-3xl font-black tracking-wide text-gray-900">
            +{data.totalEvents}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Total Tickets */}
      <Card className="border-4 border-gray-900 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardDescription className="text-sm font-bold uppercase text-gray-600">
            Total Tickets
          </CardDescription>
          <CardTitle className="text-3xl font-black tracking-wide text-gray-900">
            +{data.totalTickets}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Total Vouchers */}
      <Card className="border-4 border-gray-900 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardDescription className="text-sm font-bold uppercase text-gray-600">
            Total Vouchers
          </CardDescription>
          <CardTitle className="text-3xl font-black tracking-wide text-gray-900">
            +{data.totalVouchers}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
