import ApplyForm from "@/components/apply-form";
import SiteHeader from "@/components/site-header";
import { TicketIcon } from "lucide-react";

export default function ApplyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <TicketIcon className="mx-auto h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold mt-4 font-headline">Lottery Application</h1>
              <p className="text-muted-foreground mt-2">Complete the steps below to enter the lottery. Good luck!</p>
            </div>
            <ApplyForm />
          </div>
        </div>
      </main>
    </div>
  );
}
