// src/components/nav-user.tsx
"use client";

import { IconLogout } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function NavUser() {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-50"
      onClick={() => signOut({ callbackUrl: "/sign-in" })}
    >
      <IconLogout size={16} />
      Log out
    </Button>
  );
}
