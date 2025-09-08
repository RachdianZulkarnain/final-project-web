import { Button } from "@/components/ui/button";
import Link from "next/link";
import RoomTenantList from "./components/RoomTenantList";
import { FiPlus } from "react-icons/fi";

const RoomManagementPage = () => {
  return (
    <div>
      <div className="flex flex-grow flex-col bg-gray-100 dark:bg-gray-900 rounded-2xl">
        <section className="container mx-auto max-w-7xl space-y-10 p-6">
          <div className="border-b border-gray-200 bg-gray-50 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold  text-[#0290d1]">
                  Manage Room
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  monitor all your rooms
                </p>
              </div>
              <Link href="/dashboard/property/room/create">
                <Button className="flex items-center gap-2 shadow-sm transition-shadow hover:shadow bg-[#0290d1] hover:bg-[#70cefa]">
                  <FiPlus className="h-5 w-5" />
                  Create Room
                </Button>
              </Link>
            </div>
          </div>
          <RoomTenantList />
        </section>
      </div>
    </div>
  );
};

export default RoomManagementPage;
