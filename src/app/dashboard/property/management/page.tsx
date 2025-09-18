import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FiCalendar, FiList, FiPlus, FiSettings } from "react-icons/fi";
import PropertyTenantList from "./components/PropertyTenantList";

const PropertyManagementPage = () => {
  const actionButtons = [
    // {
    //   href: "/dashboard/property/category",
    //   label: "Manage Category",
    //   icon: <FiList className="h-5 w-5" />,
    //   variant: "secondary" as const,
    // },
    // {
    //   href: "/dashboard/property/room",
    //   label: "Manage Rooms",
    //   icon: <FiList className="h-5 w-5" />,
    //   variant: "secondary" as const,
    // },
    // {
    //   href: "/dashboard/property/peak-season-rate",
    //   label: "Peak Season Rate",
    //   icon: <FiCalendar className="h-5 w-5" />,
    //   variant: "secondary" as const,
    // },
    // {
    //   href: "/dashboard/property/management",
    //   label: "Settings",
    //   icon: <FiSettings className="h-5 w-5" />,
    //   variant: "outline" as const,
    // },
  ];

  return (
    <div className="flex flex-grow flex-col bg-gray-100 dark:bg-gray-900 rounded-2xl">
      <section className="container mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 p-4 sm:p-6 rounded-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#0290d1]">
                Manage Properties
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Monitor all your properties
              </p>
            </div>
            <Link
              href="/dashboard/property/create"
              className="self-start sm:self-auto"
            >
              <Button className="flex items-center gap-2 shadow-sm transition-shadow hover:shadow bg-[#0290d1] hover:bg-[#70cefa] w-full sm:w-auto">
                <FiPlus className="h-5 w-5" />
                Add
                <span className="hidden xs:inline">Add Property</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Action buttons */}
        {/* <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
          {actionButtons.map((btn) => (
            <Link key={btn.href} href={btn.href} className="w-full sm:w-auto">
              <Button
                variant={btn.variant}
                className="flex w-full sm:w-auto items-center justify-center gap-2"
              >
                {btn.icon}
                <span className="truncate">{btn.label}</span>
              </Button>
            </Link>
          ))}
        </div> */}

        {/* Property list */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm">
          <PropertyTenantList />
        </div>
      </section>
    </div>
  );
};

export default PropertyManagementPage;
