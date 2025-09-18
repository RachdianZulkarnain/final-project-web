"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session, update } = useSession();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const user = session?.user as
    | {
        id: number;
        email: string;
        firstName?: string;
        lastName?: string;
        imageUrl?: string;
        profilePic?: string;
        role: "user" | "tenant";
      }
    | undefined;

  const [navbar, setNavbar] = useState(!isHome);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isHome) return;

    const handleScroll = () => setNavbar(window.scrollY > 170);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };

  useEffect(() => {
    if (user?.profilePic) {
      update({
        ...session,
        user: {
          ...user,
          profilePic: user.profilePic,
        },
      });
    }
  }, [user?.profilePic, session, update]);

  if (pathname.startsWith("/profile") || pathname.startsWith("/dashboard"))
    return null;

  if (!mounted) {
    return (
      <header className="fixed top-0 w-full z-50 bg-transparent">
        <div className="flex items-center justify-between px-8 py-4 lg:px-32">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Image
              src="/assets/Homigo Logo2.png"
              alt="Homigo Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-2xl font-bold text-white">Homigo</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        navbar
          ? "bg-white border-b-2 rounded-b-3xl shadow-md"
          : "bg-transparent border-none"
      }`}
    >
      <div className="flex items-center justify-between px-8 py-4 lg:px-32">
        {/* Logo */}
        <Link
          href="/"
          className={`flex items-center gap-2 transition-all duration-500 ${
            navbar ? "text-black" : "text-white"
          }`}
        >
          <Image
            src={
              navbar ? "/assets/Homigo Logo1.png" : "/assets/Homigo Logo2.png"
            }
            alt="Homigo Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span
            className={`text-2xl font-bold ${
              navbar ? "text-[#0290d1]" : "text-white"
            }`}
          >
            Homigo
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={
                      user?.profilePic || user?.imageUrl || "/placeholder.svg"
                    }
                  />
                  <AvatarFallback>
                    {(user?.firstName?.[0] ?? user?.email[0])?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    Profile
                    <User className="mr-2 h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                {user?.role === "tenant" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-500"
                >
                  Sign Out
                  <LogOut className="mr-2 h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-4">
              <Link href="/sign-up">
                <Button
                  className={`rounded-full ${
                    navbar
                      ? "bg-[#0290d1] text-white"
                      : "bg-white text-[#0290d1]"
                  }`}
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  className={`rounded-full ${
                    navbar
                      ? "bg-[#0290d1] text-white"
                      : "bg-white text-[#0290d1]"
                  }`}
                >
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile burger */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden shadow-lg rounded-b-2xl px-6 py-6 space-y-4 bg-white">
          {user ? (
            <>
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-[#0290d1] transition-colors"
                >
                  Profile
                </Link>
                {user?.role === "tenant" && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-[#0290d1] transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </nav>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="destructive"
                  className="w-full  hover:bg-red-500"
                  onClick={handleSignOut}
                >
                  Sign Out
                  <LogOut className="mr-2 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-[#0290d1] text-white">
                  Sign Up
                </Button>
              </Link>
              <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                <Button className="w-full border-2 border-[#0290d1] text-[#0290d1] bg-white">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
