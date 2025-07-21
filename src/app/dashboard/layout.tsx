import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarSection,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardNav } from "./nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, TicketIcon } from "lucide-react";
import { logout } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarContent className="p-2">
            <SidebarHeader>
              <div className="flex items-center gap-2">
                <TicketIcon className="w-8 h-8 text-primary" />
                <span className="text-lg font-semibold font-headline">LottoLink</span>
              </div>
            </SidebarHeader>

            <DashboardNav />
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="https://placehold.co/40x40" data-ai-hint="avatar person" />
                <AvatarFallback>PO</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold">Post Office Staff</p>
                <p className="text-xs text-muted-foreground">staff@lottolink.gov</p>
              </div>
              <form action={logout}>
                <Button type="submit" variant="ghost" size="icon">
                  <LogOut className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-background flex-1">
          <header className="flex items-center justify-between p-4 border-b">
             <SidebarTrigger className="md:hidden" />
             <h1 className="text-2xl font-bold font-headline hidden md:block">Staff Dashboard</h1>
          </header>
          <main className="p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
