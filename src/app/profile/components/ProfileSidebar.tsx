"use client";

import { FC, useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Bell,
  LogOut,
  X,
  Menu,
} from "lucide-react";

interface ProfileSidebarProps {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const ProfileSidebar: FC<ProfileSidebarProps> = ({
  activeIndex,
  setActiveIndex,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navbarItems = [
    { name: "Personal info", icon: Home },
    { name: "Notifications", icon: Bell },
  ];

  const handleLogout = () => signOut({ callbackUrl: "/sign-in" });

  return (
    <div className="relative">
      {/* Hamburger button for mobile */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden p-4 z-50 fixed top-4 left-4"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white p-6 shadow-lg rounded-r-xl z-40 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col justify-between overflow-y-auto`}
      >
        {/* Close button on mobile */}
        <div className="md:hidden flex justify-end mb-12">
          <button onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center mb-10 pl-2">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Image
              src="/assets/Homigo Logo1.png"
              alt="Homigo Logo"
              width={45}
              height={45}
              className="object-contain"
            />
            <span className="text-2xl font-bold text-[#0290d1]">Homigo</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1">
          <ul>
            {navbarItems.map((item, index) => (
              <li key={item.name} className="mb-2">
                <button
                  onClick={() => {
                    setActiveIndex(index);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200
                    ${index === activeIndex ? "bg-primary text-white font-medium" : ""}`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Logout for mobile */}
          <div className="md:hidden mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-red-500 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </nav>

        {/* Logout for desktop */}
        <div className="hidden md:block mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-red-500 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileSidebar;
