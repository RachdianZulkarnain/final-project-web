"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import PropertyTenantList from "./components/PropertyTenantList";

const MotionButton = motion(Button);

const PropertyManagementPage = () => {
  return (
    <div className="flex flex-grow flex-col bg-gray-100 dark:bg-gray-900 rounded-2xl">
      <section className="container mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
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
              className="self-start sm:self-auto w-full sm:w-auto"
            >
              <MotionButton
                className="flex items-center gap-2 shadow-sm transition-shadow bg-[#0290d1] hover:bg-[#70cefa] w-full sm:w-auto"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus className="h-5 w-5" />
                <span className="hidden xs:inline">Add Property</span>
              </MotionButton>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm">
          <PropertyTenantList />
        </div>
      </section>
    </div>
  );
};

export default PropertyManagementPage;
