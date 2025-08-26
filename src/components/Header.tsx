"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Home, Search, Calendar, MessageCircle } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  // session.user diambil dari NextAuth, pastikan adapter NextAuth kamu mapping ke Prisma User
  const user = session?.user as
    | {
        id: number;
        email: string;
        firstName?: string;
        lastName?: string;
        imageUrl?: string;
        role: "user" | "tenant";
      }
    | undefined;

  const [navbar, setNavbar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const pageScrolled = () => setNavbar(window.scrollY > 170);
  const pageResized = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", pageResized);
    if (windowWidth < 769) setNavbar(true);
    else window.addEventListener("scroll", pageScrolled);

    return () => {
      window.removeEventListener("scroll", pageScrolled);
      window.removeEventListener("resize", pageResized);
    };
  }, [windowWidth]);

  return (
    <div>
      {navbar ? (
        <div className="fixed top-0 w-full z-50 transition rounded-b-3xl">
          <div className="py-4 px-8 lg:px-32 flex justify-between items-center bg-white border-b-2 rounded-b-3xl">
            {/* Logo */}
            <Link href="/" className="flex gap-2 items-center text-black">
              <Home />
              <span className="text-2xl font-bold">Homigo</span>
            </Link>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center gap-3 bg-black text-white rounded-full px-4 py-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {(user.firstName?.charAt(0) ?? user.email[0]).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex text-sm">
                  {user.firstName ?? user.email}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                      ☰
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    {user.role === "tenant" && (
                      <DropdownMenuItem asChild>
                        <Link href="/my-listings">My Listings</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="space-x-4 flex">
                <Link href="/sign-up">
                  <Button className="hidden md:flex rounded-full">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    className="rounded-full bg-black text-white md:text-black md:bg-white md:border-2 md:border-black"
                    variant={"outline"}
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="fixed top-0 w-full z-50">
          <div className="py-4 px-8 lg:px-32 flex justify-between items-center text-white">
            {/* Logo */}
            <Link href="/" className="flex gap-2 items-center">
              <Home />
              <span className="text-2xl font-bold">Homigo</span>
            </Link>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center gap-3 bg-white text-black rounded-full px-4 py-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                  <AvatarFallback>
                    {(user.firstName?.charAt(0) ?? user.email[0]).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex text-sm">
                  {user.firstName ?? user.email}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      ☰
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    {user.role === "tenant" && (
                      <DropdownMenuItem asChild>
                        <Link href="/my-listings">My Listings</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="space-x-4 flex">
                <Button
                  className="hidden md:flex rounded-full bg-white text-black"
                  onClick={() => signIn("credentials")}
                >
                  Sign Up
                </Button>

                <Button
                  className="rounded-full bg-black text-white md:bg-transparent md:border-2"
                  variant="outline"
                  onClick={() => signIn()}
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
