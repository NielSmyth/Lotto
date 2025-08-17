import Link from "next/link";
import { TicketIcon, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { getSession } from "@/lib/session";
import { logout } from "@/lib/auth";

interface SiteHeaderProps {
  hideNavLinks?: boolean;
}

export default async function SiteHeader({ hideNavLinks = false }: SiteHeaderProps) {
  const session = await getSession();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-card border-b">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <TicketIcon className="h-6 w-6 text-primary" />
        <span className="ml-2 text-xl font-bold font-headline">LottoLink</span>
      </Link>
      <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
        {!hideNavLinks && (
            <>
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
          </>
        )}
        
        {session ? (
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
              
              {session.role === 'ADMIN' && (
                 <DropdownMenuItem asChild>
                    <Link href="/dashboard">Staff Dashboard</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
               <DropdownMenuItem>
                  <form action={logout}>
                    <button type="submit" className="w-full text-left">Logout</button>
                  </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          !hideNavLinks && (
            <>
                <Button variant="outline" asChild>
                <Link href="/login" className="text-sm font-medium" prefetch={false}>
                    Login
                </Link>
                </Button>
                <Button asChild>
                <Link href="/signup" className="text-sm font-medium" prefetch={false}>
                    Sign Up
                </Link>
                </Button>
            </>
          )
        )}
        
        <ThemeToggle />
      </nav>
    </header>
  );
}
