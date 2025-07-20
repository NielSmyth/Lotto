import Link from "next/link";
import { TicketIcon, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function SiteHeader() {
  // Mock user state
  const isLoggedIn = true; 

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-card border-b">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <TicketIcon className="h-6 w-6 text-primary" />
        <span className="ml-2 text-xl font-bold font-headline">LottoLink</span>
      </Link>
      <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
        <Button variant="ghost" asChild>
          <Link href="/apply" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Apply
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/status" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Check Status
          </Link>
        </Button>
        
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/my-applications">My Applications</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
               <DropdownMenuItem>
                  <Link href="/dashboard">Staff Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" asChild>
            <Link href="/login" className="text-sm font-medium" prefetch={false}>
              Login
            </Link>
          </Button>
        )}
        
        <ThemeToggle />
      </nav>
    </header>
  );
}
