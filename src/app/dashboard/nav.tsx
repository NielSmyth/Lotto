"use client";

import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Users, BotMessageSquare } from "lucide-react";
import Link from "next/link";

export function DashboardNav() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/dashboard",
      label: "Applicants",
      icon: Users,
      isActive: pathname === "/dashboard",
    },
    {
      href: "/dashboard/process-results",
      label: "AI Result Processor",
      icon: BotMessageSquare,
      isActive: pathname === "/dashboard/process-results",
    },
  ];

  return (
    <SidebarMenu className="p-2">
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Button
            asChild
            variant={item.isActive ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
