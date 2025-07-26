"use client";

import { logout } from "@/lib/auth";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export function LogoutButton() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenuItem onClick={handleLogout}>
      Logout
    </DropdownMenuItem>
  );
}