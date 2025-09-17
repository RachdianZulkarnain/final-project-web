import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { FiCalendar, FiList, FiPlus, FiSettings } from "react-icons/fi";
import PropertyTenantList from "./components/PropertyTenantList";

const PropertyManagementPage = () => {
  const actionButtons = [
    {
      href: "/dashboard/property/category",
      label: "Manage Category",
      icon: <FiList className="h-5 w-5" />,
      variant: "secondary" as const,
    },
    {
      href: "/dashboard/property/room",
      label: "Manage Rooms",
      icon: <FiList className="h-5 w-5" />,
      variant: "secondary" as const,
    },
    {
      href: "/dashboard/property/peak-season-rate",
      label: "Peak Season Rate",
      icon: <FiCalendar className="h-5 w-5" />,
      variant: "secondary" as const,
    },
    {
      href: "/dashboard/property/management",
      label: "Settings",
      icon: <FiSettings className="h-5 w-5" />,
      variant: "outline" as const,
    },
  ];

  return (
    <div className="flex flex-grow flex-col bg-gray-100 dark:bg-gray-900 rounded-2xl">
      <section className="container mx-auto max-w-7xl space-y-8 p-6">
        <div className="border-b border-gray-200 bg-gray-50 p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold  text-[#0290d1]">
                Manage Properties
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                monitor all your properties
              </p>
            </div>
            <Link href="/dashboard/property/create">
              <Button className="flex items-center gap-2 shadow-sm transition-shadow hover:shadow bg-[#0290d1] hover:bg-[#70cefa]">
                <FiPlus className="h-5 w-5" />
                Add Property
              </Button>
            </Link>
          </div>
        </div>
        <div className="p-6">
          <PropertyTenantList />
        </div>
      </section>
    </div>
  );
};

export default PropertyManagementPage;
