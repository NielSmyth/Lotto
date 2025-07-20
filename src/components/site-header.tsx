import Link from "next/link";
import { TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export default function SiteHeader() {
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
        <Button variant="outline" asChild>
          <Link href="/dashboard" className="text-sm font-medium" prefetch={false}>
            Staff Dashboard
          </Link>
        </Button>
        <ThemeToggle />
      </nav>
    </header>
  );
}
