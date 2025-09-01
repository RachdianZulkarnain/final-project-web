"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

export default function Header() {
  const { data: session, update } = useSession(); // ✅ ambil update
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

  // ✅ refresh session user kalau ada perubahan profilePic
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

  // ✅ sembunyikan header di halaman profile
  if (pathname.startsWith("/profile")) return null;

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

        {user ? (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={user?.profilePic || user?.imageUrl || "/placeholder.svg"}
              />
              <AvatarFallback>
                {(user?.firstName?.[0] ?? user?.email[0])?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  ☰
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/order">Order History</Link>
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
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link href="/sign-up">
              <Button
                className={`hidden md:flex rounded-full transition-colors duration-300 ${
                  navbar ? "bg-[#0290d1] text-white" : "bg-white text-[#0290d1]"
                }`}
              >
                Sign Up
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                className={`rounded-full transition-colors duration-300 ${
                  navbar
                    ? "bg-black text-white"
                    : "bg-white text-black border-2"
                } md:bg-transparent md:border-2 ${
                  navbar
                    ? "md:border-[#0290d1] md:text-[#0290d1]"
                    : "md:border-white md:text-white"
                }`}
              >
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
